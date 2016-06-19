require.config({
    baseUrl: 'static/js/modules/',
    paths: {
        zepto: '../libs/zepto.min',
        util: '../libs/util',
        navigation: '../libs/navigation',
    },
    shim:{
        zepto: {exports: '$'}
    }       
});


require(["zepto","util","navigation"],function($,util,nav){

   
	//绑定主播列表信息
	function bindDataList(){


		 $.ajax({  
            type : "get",  
            //url : config.apiHost+"anchor/getanchorlist/",
            url : config.apiHost+"json/zhubolist.aspx",
            data:{
                page:1,
                size:10
            },
            dataType:"json",
            success : function(resp) {

                if(resp.code==200){
                	var listHtml="";
                	var dataList=resp.data.list;
                	for(var i=0;i<dataList.length;i++){
                		var itemHtml=$("#tplItem").html();
                		var indexIcon=""
                		if(i<=2){
                			indexIcon="n"+parseInt(i+1);
                		}
                		itemHtml=itemHtml.replace("{{index}}",indexIcon);
                		itemHtml=itemHtml.replace("{{id}}",dataList[i].anchor_id);
                		itemHtml=itemHtml.replace("{{thumb}}",dataList[i].thumb);
                		itemHtml=itemHtml.replace("{{anchor_name}}",dataList[i].anchor_name);
                		listHtml+=itemHtml;
                	}
                	$("#divZhuboList").append(listHtml);
                }
                else{
                	util.alert(resp.message);
                }
            }
        });
	}

	//
	function main(){
		bindDataList();
		nav.bind("zhubo");
	}
	main();

})