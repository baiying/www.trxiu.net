require.config({
    baseUrl: 'static/js/modules/',
    paths: {
        zepto: '../libs/zepto.min',
        login: '../libs/login',
        util: '../libs/util',
        navigation: '../libs/navigation',
        jweixin:'../libs/jweixin-1.0.0'
    },
    shim:{
        zepto: {exports: '$'}
    }       
});


require(["zepto","login","util","navigation","jweixin"],function($,login,util,nav,wx){

    var params=util.getParams();



    //绑定页面事件
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
                    ballot_id:util.getCookie("ballot_id"),
                    anchor_id:params["anchor_id"],
                    fans_id: window.userInfo.openid
                },
                dataType:"json",
                success : function(resp) {
                    if(resp.status=="success"){
                        //util.alert(resp.message);
                        $("#divMskSuccess").show();
                    }
                    else{
                        util.alert(resp.message);
                    }
                }
            });
        })




        //隐藏成功面板
        $("body").on("click",".btnConfirm",function(){
            $("#divMskSuccess").hide();
        })


    }



    /*


ballot_id 活动ID
anchor_id 主播ID
fans_id 发起拉票的粉丝ID
source_id 来源拉票ID
charge 充值金额，以分为单位的整数
status 拉票状态，1 有效，2 待支付，3 无效

    */

    //支付结果通知
    function payResultEvent(total){
        $.ajax({  
            type : "post",  
            url : config.apiHost+"ajax-canvass/create/",
            data:{
                ballot_id:util.getCookie("ballot_id"),
                anchor_id:params["anchor_id"],
                fans_id: window.userInfo.fansid,
                source_id:params["source_id"],
                charge:total,
                status:1
            },
            dataType:"json",
            success : function(resp) {
                if(resp.status=="success"){
                    location.href="paysuccess.html?anchor_id="+params["anchor_id"]+"&ballot_id="+params["ballot_id"]+"&canvass_id="+resp.data.canvass_id;
                }
                else{
                    util.alert(resp.message);
                }
            }
        });
    }
   

    //绑定支付事件
    function bindPayEvent(){
        //选择金额去拉票
        $("#btnPay").click(function(){
            var total= parseInt($(this).attr("data-amount"));
            var totalPay = 2;
            $.ajax({  
                type : "post",  
                url : config.apiHost+"ajax-pay/wx-prepay/",
                data:{
                    fans_id: window.userInfo.fansid,
                    openid:window.userInfo.openid,
                    ballot_id:params["ballot_id"],
                    anchor_id:params["anchor_id"],
                    total:totalPay
                },
                dataType:"json",
                success : function(resp) {
                    if(resp.status=="success"){
                        var payInfo=resp.data;
                        wx.ready(function () {
                            wx.chooseWXPay({
                               'timestamp': resp.data.timeStamp, 
                               'nonceStr': resp.data.nonceStr, 
                               'package': resp.data.package, 
                               'signType': resp.data.signType, 
                               'paySign': resp.data.paySign, 
                               success: function (res) {
                                    payResultEvent(parseInt(total/100));
                               }
                           });
                        });
                    }
                    else{
                        util.alert(resp.message);
                    }
                }
            });
        })
    }


    //绑定微信jsapi配置信息
    function bindWXConfig(){
        $.ajax({  
            type : "post",  
            url : config.apiHost+"ajax-account/get-js-sign/",
            data:{
                url:location.href,
            },
            dataType:"json",
            success : function(resp) {

                if(resp.status=="success"){
                    wx.config({
                        beta: true, // 必填，开启内测接口调用，注入wx.invoke和wx.on方法       
                        debug: false,//如果在测试环境可以设置为true，会在控制台输出分享信息； 
                        appId:resp.data.appId, // 必填，公众号的唯一标识
                        timestamp:resp.data.timestamp , // 必填，生成签名的时间戳
                        nonceStr:resp.data.nonceStr, // 必填，生成签名的随机串
                        signature:resp.data.signature,// 必填
                        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','hideMenuItems','hideAllNonBaseMenuItem','playVoice','chooseWXPay'] // 必填
                    });
                    bindPayEvent();
                }
                else{
                    util.alert(resp.message);
                }
            }
        });
    }


    function main(){
        bindWXConfig();
        bindPageEvents();
        nav.bind("zhubo");
    }
    
    login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })

})