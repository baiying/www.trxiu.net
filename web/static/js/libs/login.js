define(['zepto'],
function($) {
  
    var Logincheck = {
        init: function(callback) {
          
            var $this = this;
            $this.setCookie("DA7F9084C361196F1147D0DE68FEC172", "", 0);


            if ( !! $this.getCookie("DA7F9084C361196F1147D0DE68FEC172")) {
                var c_openid = $this.getCookie("DA7F9084C361196F1147D0DE68FEC172");
                callback(c_openid);
            } else {
                var REDIRECT_URI = encodeURIComponent(location.href);
                var openurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx0a1799c10d53e3c0&redirect_uri=" + REDIRECT_URI + "&response_type=code&scope=snsapi_base&state=1#wechat_redirect";

                if ($this.GetURLParameter('code')) {
                    var code=$this.GetURLParameter('code');
                    alert(code)
                    $.ajax({
                        url:config.apiHost+"ajax-account/login-by-code/",
                        type : "post",  
                        data:{
                            code:code
                        },
                        success:function(resp){
                
                            var value=JSON.stringify(resp);
                            $this.setCookie("DA7F9084C361196F1147D0DE68FEC172", value, 1440);
                            callback(resp)
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
            document.cookie = NameOfCookie + "=" + escape(value) + ((expiredays == null) ? "": "; expires=" + ExpireDate.toGMTString()) + ";domain=.wepiao.com;";
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