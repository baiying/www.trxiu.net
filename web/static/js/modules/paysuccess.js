require.config({
    baseUrl: 'static/js/modules/',
    urlArgs: "bust=" +  (new Date()).getTime(),
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


    var params=util.getParams();



    //绑定分享信息
    function bindShareInfo(){
        
        $.ajax({  
            type : "post",  
            url : config.apiHost+"ajax-account/get-js-sign/",
            data:{
                url:location.href,
            },
            dataType:"json",
            success : function(resp) {
                console.log(resp)
                console.log(resp.data.signature)

                if(resp.status=="success"){
                    wx.config({
                        beta: true, // 必填，开启内测接口调用，注入wx.invoke和wx.on方法       
                        debug: false,//如果在测试环境可以设置为true，会在控制台输出分享信息； 
                        appId:resp.data.appId, // 必填，公众号的唯一标识
                        timestamp:resp.data.timestamp , // 必填，生成签名的时间戳
                        nonceStr:resp.data.nonceStr, // 必填，生成签名的随机串
                        signature:resp.data.signature,// 必填
                        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','hideMenuItems','hideAllNonBaseMenuItem','playVoice'] // 必填
                    });
                    wx.ready(function(res){


                        wx.onMenuShareTimeline({
                            title : window.ShareDescripion,
                            link :config.currentDomain+"lapiaodetail.html?anchor_id="+ params["anchor_id"]+"&ballot_id="+params["ballot_id"],
                            imgUrl :window.shareImage
                        });

                        //分享给朋友
                        wx.onMenuShareAppMessage({
                            title :window.ShareTile,
                            desc : window.ShareDescripion,
                            link :config.currentDomain+"lapiaodetail.html?anchor_id="+ params["anchor_id"]+"&ballot_id="+params["ballot_id"],
                            imgUrl:window.shareImage
                        }); 
                    })
                }
                else{
                    util.alert(resp.message);
                }
            }
        });
    }


	function main(){

		
	}


    login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })
	

})