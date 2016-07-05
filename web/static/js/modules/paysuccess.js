require.config({
    baseUrl: 'static/js/modules/',
    paths: {
        zepto: '../libs/zepto.min',
        login: '../libs/login',
        util: '../libs/util',
        navigation: '../libs/navigation',
        imgPreview: '../libs/imgPreview',
        jweixin:'../libs/jweixin-1.0.0'
    },
    shim:{
        zepto: {exports: '$'}
    }       
});


require(["zepto","login","util","imgPreview","jweixin"],function($,login,util,imgPreview,wx){


    var params=util.getParams();

    //获取页面数据
    function getAjaxData(callback){
        $.ajax({  
            type : "get",  
            url : config.apiHost+"ajax-ballot/anchor-in-ballot/",
            data:{
                ballot_id:util.getCookie("ballot_id"),
                anchor_id: params["anchor_id"],
                openid:window.userInfo.openid
            },
            dataType:"json",
            success : function(resp) {
                if(resp.status=="success"){
                    window.shareImage=resp.data.ShareImg;
                    window.ShareTile=resp.data.ShareTile;
                    window.ShareDescripion=resp.data.ShareDescripion;
                }
                else{
                    util.alert(resp.message);
                }
            },
            complete:function(){
                callback();
            }
        });
    }

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
                            link :config.currentDomain+"hongbao.html?canvass_id=",
                            imgUrl :window.shareImage
                        });

                        //分享给朋友
                        wx.onMenuShareAppMessage({
                            title :window.ShareTile,
                            desc : window.ShareDescripion,
                            link :config.currentDomain+"hongbao.html?canvass_id=",
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
        getAjaxData(function(){
            bindShareInfo();

        });
		
	}


    login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })
	

})