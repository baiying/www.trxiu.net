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
    var shared=false;   //是否已分享
    var shareUrl="";
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
                    $("#divTotal").html(resp.data.charge);
                    var pHtml='活动时间（'+resp.data.active_time+'-'+resp.data.end_time+'）';
                    $("#pHuoDongTitle").html(pHtml);
                    shareUrl=resp.data.url;
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

    //绑定页面各个事件
    function bindEvents(){

        $("#btnReceive").click(function(){
            // if(shared==false){
            //     util.alert("必须先分享后才能领取");
            //     return;
            // }
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
                        location.href="hongbaoinfo.html?canvass_id="+params["canvass_id"];
                        //util.alert("领取成功，请在微信服务通知中领取");
                    }
                    else{
                        util.alert(resp.message);
                    }
                }
            });
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
                            title : "盟主派对",
                            link :shareUrl,
                            imgUrl :"",
                            success:function(){
                                shared=true;
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
        });
        
	}
	login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })

})