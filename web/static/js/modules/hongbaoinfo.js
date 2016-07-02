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


require(["zepto","util","login"],function($,util,login){


    var params=util.getParams();

    //绑定红包页面基本信息
    function getInfo(callback){

        $.ajax({  
            type : "get",  
            url : config.apiHost+"ajax-canvass/info/",
            data:{
                canvass_id: params["canvass_id"]
            },
            dataType:"json",
            success : function(resp) {
                if(resp.status=="success"){
                    $("#fTotal").html(resp.data.charge);
                    $("#sgetTotal").html(resp.data.charge);
                    $("#h3FansName").html(resp.data.fans_name);

                    

                    
                    
                    
                }
                else{
                    util.alert(resp.message);
                }
            },
            complete:function(){
                if(!!callback){callback()}
            }
        });
    }


	//
	function main(){
		getInfo();
        
	}
	login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })

})