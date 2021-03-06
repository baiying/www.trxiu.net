require.config({
    baseUrl: 'static/js/modules/',
    paths: {
        zepto: '../libs/zepto.min',
        login: '../libs/login',
        util: '../libs/util',
        navigation: '../libs/navigation',
    },
    shim:{
        zepto: {exports: '$'}
    }       
});


require(["zepto","login","util","navigation"],function($,login,util,nav){

   

    function bindList1(dataInfo){
        var dataList=dataInfo;
        var listHtml="";
        for(var i=0;i<dataList.length;i++){
            var itemHtml=$("#tplItem1").html();
            var sort="";
            if(dataList[i].sort<=3){
                sort="n"+dataList[i].sort
            }
            itemHtml=itemHtml.replace("{{sort}}",sort);
            itemHtml=itemHtml.replace("{{logo}}",dataList[i].logo);
            itemHtml=itemHtml.replace("{{level}}",dataList[i].level);
            itemHtml=itemHtml.replace("{{title}}",dataList[i].title);
            itemHtml=itemHtml.replace("{{image}}",dataList[i].image);

            listHtml+=itemHtml;
        }

        $("#divList").html(listHtml);
    }

    function bindInfo(dataInfo){

        var title=dataInfo.ballot_name+"("+dataInfo.begin_time+"-"+dataInfo.end_time+")";
        $("#pHuoDongTitle").html(title);
    }


    function getAjax(){

        var ballot_id= util.getCookie("ballot_id");
        $.ajax({  
            type : "get",  
            url : config.apiHost+"ajax-ballot/ballot-prize/",
            data:{
                ballot_id:ballot_id
            },
            dataType:"json",
            success : function(resp) {
                
                if(resp.status=="success"){
                    bindInfo(resp.data);
                    bindList1(resp.data.parizeList);

                    //活动状态不是1则显示活动结束
                    if(resp.data.status==3){
                        $(".endIcon").show();
                    }
                }
                else{
                    util.alert(resp.message);
                }
            },
            complete:function(){
                $("#loading").hide();
            }
        });
    }



	//
	function main(){
		getAjax();
		nav.bind("dajiang");
	}
	login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })

})