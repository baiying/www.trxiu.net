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

    
    //获取页面数据
    function getAjaxData(callback){
        var params=util.getParams();
        $.ajax({  
            type : "get",  
            url : config.apiHost+"ajax-news/get-news-comment-list/",
            data:{
                news_id:params["news_id"]
            },
            dataType:"json",
            success : function(resp) {
                if(resp.status=="success"){
                    
                }
                else{
                    util.alert(resp.message);
                }
            },
            complete:function(){
                $("#loading").hide();
                callback();
            }
        });
    }

	//
	function main(){
		getAjaxData();
		nav.bind("zhubo");
	}
	main();

})