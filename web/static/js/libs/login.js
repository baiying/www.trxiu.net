define(['zepto'],
function($) {
  
    var Logincheck = {
        init: function(callback) {
            // callback({
            //     openid: "o5keCwvdLM1rseZdqpclWbBi5idg",
            //     name: "风一样的男子",
            //     fansid: 41,
            //     thumb: "http://wx.qlogo.cn/mmopen/kT0qibicf86iaYPfRibkCFIg…YAJ3gibntVXcovoTKXe4srjjiccBX9xZOA8W9b5icklOluU/0"
            // });
            // return;
            var $this = this;
            if ( !! $this.getCookie("DA7F9084C361196F1147D0DE68FEC172")) {
                var userInfo = $this.getCookie("DA7F9084C361196F1147D0DE68FEC172");
                userInfo=decodeURIComponent(userInfo);
                callback($.parseJSON(userInfo));
            } else {
                var REDIRECT_URI = encodeURIComponent(location.href);

                //wx0a1799c10d53e3c0
                var openurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxcbfa7f22b7956568&redirect_uri=" + REDIRECT_URI + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";

                if ($this.GetURLParameter('code')) {
                    var code=$this.GetURLParameter('code');
                   
                    $.ajax({
                        url:config.apiHost+"ajax-account/login-by-code/",
                        type : "post",  
                        data:{
                            code:code
                        },
                        dataType:"json",
                        success:function(resp){
                            //alert(JSON.stringify(resp));
                            if(resp.status=="success"){
                                var value=JSON.stringify(resp.data);
                                $this.setCookie("DA7F9084C361196F1147D0DE68FEC172", encodeURIComponent(value), 30);
                                callback(resp.data);
                            }
                            else{
                                alert(resp.message);
                            }
                            
                        }
                    })

                } else {
                    location.href = openurl;
                }

            }

        },
        GetURLParameter: function(paras) {
            var url = decodeURIComponent(location.href.replace("#rd", ""));
            var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
            var paraObj = {}
            for (i = 0; j = paraString[i]; i++) {
                paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
            }
            var returnValue = paraObj[paras.toLowerCase()];
            if (typeof(returnValue) == "undefined") {
                return "";
            } else {
                return returnValue;
            }
        },
        setCookie: function(NameOfCookie, value, expiredays) {
            var ExpireDate = new Date();
            ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000));
            document.cookie = NameOfCookie + "=" + escape(value) + ((expiredays == null) ? "": "; expires=" + ExpireDate.toGMTString()) + ";";
        },
        getCookie: function(NameOfCookie) {
            if (document.cookie.length > 0) {
                var begin = document.cookie.indexOf(NameOfCookie + "=");
                if (begin != -1) {
                    begin += NameOfCookie.length + 1;
                    var end = document.cookie.indexOf(";", begin);
                    if (end == -1) end = document.cookie.length;
                    return unescape(document.cookie.substring(begin, end));
                }
            }
            return null;
        }
    };
    return Logincheck;
});