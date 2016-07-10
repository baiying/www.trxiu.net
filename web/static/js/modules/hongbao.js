require.config({
    baseUrl: 'static/js/modules/',
    paths: {
        zepto: '../libs/zepto.min',
        util: '../libs/util',
        navigation: '../libs/navigation',
        login: '../libs/login',
        jweixin:'../libs/jweixin-1.0.0'
    },
    shim:{
        zepto: {exports: '$'}
    }       
});


require(["zepto","util","login","jweixin"],function($,util,login,wx){


    var params=util.getParams();
    var shared=false;   //是否已分享

    //绑定红包页面基本信息
    function getInfo(callback){

        $.ajax({  
            type : "get",  
            url : config.apiHost+"ajax-canvass/info/",
            data:{
                canvass_id: params["canvass_id"],
                openid:window.userInfo.openid
            },
            dataType:"json",
            success : function(resp) {
                if(resp.status=="success"){

                    //已经领取过
                    if(resp.data.isReceive==1){
                        location.href="hongbaoinfo.html?canvass_id="+params["canvass_id"];
                    }

                    window.shareImage=resp.data.ShareImg;
                    window.ShareTitle=resp.data.ShareTitle;
                    window.ShareDescripion=resp.data.ShareDescripion;
                    $("#divTotal").html(resp.data.charge);
                    var pHtml='活动时间（'+resp.data.active_time+'-'+resp.data.end_time+'）';
                    $("#pHuoDongTitle").html(pHtml);

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



    function getHongbao(){
        $.ajax({  
            type : "get",  
            url : config.apiHost+"ajax-canvass/receive-redpackage/",
            data:{
                ballot_id: params["ballot_id"],
                canvass_id: params["canvass_id"],
                fans_id: window.userInfo.fansid
            },
            dataType:"json",
            success : function(resp) {
                if(resp.status=="success"){
                    location.href="hongbaoinfo.html?canvass_id="+params["canvass_id"]+"&amount="+resp.data.amount;
                    
                }
                else{
                    util.alert(resp.message);
                }
            }
        });
    }

    //绑定页面各个事件
    function bindEvents(){

        $("#btnReceive").click(function(){
            $("#divShare").show();
            
        })


         //关闭遮罩层
        $(".mask").click(function(){
            $(this).hide();
        })


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
                            link :config.currentDomain+"hongbao.html?canvass_id="+params["canvass_id"]+"&ballot_id="+params["ballot_id"],
                            imgUrl :window.shareImage,
                            success:function(){
                                getHongbao();
                            }
                        });

                        //分享给朋友
                        wx.onMenuShareAppMessage({
                            title :window.ShareTitle,
                            desc : window.ShareDescripion,
                            link :config.currentDomain+"hongbao.html?canvass_id="+params["canvass_id"]+"&ballot_id="+params["ballot_id"],
                            imgUrl:window.shareImage,
                            success:function(){
                                getHongbao();
                            }
                        }); 
                    })
                }
                else{
                    util.alert(resp.message);
                }
            }
        });

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