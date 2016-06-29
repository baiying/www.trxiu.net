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




    function bindPageEvents(){

        //选择拉票金额
        $("#divAmountTotal>span").click(function(){
             $("#divAmountTotal>span").removeClass("on");
             $(this).addClass("on");
        })






        //免费投一票
        $("#btnFreeSubmit").click(function(){
            var params=util.getParams();
            $.ajax({  
                type : "post",  
                url : config.apiHost+"ajax-vote/vote/",
                data:{
                    ballot_id:params["ballot_id"],
                    anchor_id:params["anchor_id"],
                    fans_id: window.userInfo.openid
                },
                dataType:"json",
                success : function(resp) {
                    if(resp.status=="success"){
                        util.alert(resp.message);
                    }
                    else{
                        util.alert(resp.message);
                    }
                }
            });
        })
    }
   

    //
    function main(){
        bindPageEvents();
        nav.bind("zhubo");
    }
    
    login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })

})