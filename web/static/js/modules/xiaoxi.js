require.config({
    baseUrl: 'static/js/modules/',
    paths: {
        zepto: '../libs/zepto.min',
        util: '../libs/util',
        navigation: '../libs/navigation',
        login: '../libs/login',
    },
    shim:{
        zepto: {exports: '$'}
    }       
});


require(["zepto","util","navigation","login"],function($,util,nav,login){

    var pageIndex=0;

    function bindDataList(){
         $.ajax({  
            type : "post",  
            url : config.apiHost+"ajax-message/get-message-list/",
            data:{
                openid:window.userInfo.openid,
                page:pageIndex,
                size:100
            },
            dataType:"json",
            success : function(resp) {
                if(resp.status=="success"){
                    renderHtml(resp.data);
                }
                else{
                    util.alert(resp.message);
                }
            }
        });
    }


    function renderHtml(dataInfo){
        var listHtml="";
        var dataList=dataInfo.list;
        for(var i=0;i<dataList.length;i++){
            var itemHtml=$("#tplItem").html();
            itemHtml=itemHtml.replace("{{create_time}}",dataList[i].create_time);
            itemHtml=itemHtml.replace("{{content}}",dataList[i].content);
            listHtml+=itemHtml;
        }
        $("#divXiaoXiList").append(listHtml);
    }



	//
	function main(){
		bindDataList()
		nav.bind("xiaoxi");
	}
	login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })

})