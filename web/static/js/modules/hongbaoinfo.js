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
                    $("#sgetTotal").html(params["amount"]);
                    $("#spBestUserImg").html('<img src="'+resp.data.fans_thumb+'" />');
                    $("#h3FansName").html(resp.data.fans_name);

                    $("#bestThumb").html('<img src="'+resp.data.best_user_thumb+'" />');
                    $("#bsetNickName").html(resp.data.best_user_name);
                    $("#spBestTotal").html(resp.data.best_amount);
                    
                    window.ballot_id=resp.data.ballot_id;
                    window.anchor_id=resp.data.anchor_id;
                
                    
                    
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

    function bindEvents(){

        $(".btn1,.btn2").click(function(){
            location.href="zhubolist.html";
        })
    }


	//
	function main(){
		getInfo(function(){
            bindEvents();
            util.setCookie("source_id",params["canvass_id"]);
        });
        
	}
	login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })

})