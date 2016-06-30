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

   

    function bindInfo(){
        $.ajax({  
            type : "post",  
            url : config.apiHost+"ajax-system/setting/",
            dataType:"json",
            success : function(resp) {
                console.log(resp)
                if(resp.status=="success"){
                    $("#divTouPiao").html(resp.data.rule_vote);
                    $("#divHongbao").html(resp.data.rule_red);
                    
                }
                else{
                    util.alert(resp.message);
                }
            }
        });
    }


	//
	function main(){
		bindInfo();
		nav.bind("guize");
	}
	login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })

})