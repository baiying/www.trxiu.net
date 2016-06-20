~(function(){
    var logincheck_api = config.syhapiHost+"Common/Loginwechat?callback=syhlogin&_versions=";
    var REDIRECT_URI = encodeURIComponent("http://wx.wepiao.com/cgi/bonus_proxy.php?url="+encodeURIComponent(location.href));
    var openurl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx92cf60f7577e2d48&redirect_uri="+REDIRECT_URI+"&response_type=code&scope=snsapi_base&state=1#wechat_redirect";
    var wechat_login = function(){};
   


    wechat_login.prototype = {
        constructor:wechat_login,
        init:function(){
          var $this = this;
          var _openid = $this.GetURLParameter("openid");
              if(_openid){
                mygetopid("WxOpenId",_openid);
              }else if(!!$this.getCookie("SYH_openId")){
                var c_openid = $this.getCookie("SYH_openId");

                   mygetopid("WxOpenId",c_openid);
              }else{
                  $this.weimovie_logincheck();
              }
        },
        weimovie_logincheck:function(){
           var $this = this;
           var append;
           var myDate = new Date();
           var versions = myDate.getMilliseconds()+myDate.getSeconds();
           
              if ($this.GetURLParameter('code')) {
                    append = '&wxcode=' + $this.GetURLParameter('code');
                    this.getJsonp(logincheck_api + versions + append);
              } else {
                     window.location.href= openurl;
              }
        },
        GetURLParameter:function(paras) {
            var url = location.href; 
            var paraString = url.substring(url.indexOf("?")+1,url.length).split("&"); 
            var paraObj = {} 
            for (i=0; j=paraString[i]; i++){ 
                paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length); 
            } 
            var returnValue = paraObj[paras.toLowerCase()]; 
            if(typeof(returnValue)=="undefined"){ 
              return ""; 
            }else{ 
              return returnValue; 
            } 
        },
        setCookie:function(NameOfCookie, value, expiredays){ 
          var ExpireDate = new Date (); 
          ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000)); 

          document.cookie = NameOfCookie + "=" + escape(value) + 
            ((expiredays == null) ? "" : "; expires=" + ExpireDate.toGMTString()); 
        },
        getCookie:function(NameOfCookie){ 
          if (document.cookie.length > 0){ 
             begin = document.cookie.indexOf(NameOfCookie+"="); 
          if (begin != -1){ 
             begin += NameOfCookie.length+1;
             end = document.cookie.indexOf(";", begin);
          if (end == -1) end = document.cookie.length;
           return unescape(document.cookie.substring(begin, end)); } 
          } 
          return null; 
        },
        getJsonp:function(url){
            var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                script.onload = function() {
                     head.removeChild(script);
                     //Lotterycallback();
                }
                script.src = url;
                head.appendChild(script);
        }
    };
    
    window.syhlogin = function(res){
         var sdata = res.data;
         if(res.apicode == 10000){
            var s_openid = sdata.wxopenidcrypt;
            var SaveOpenid = new wechat_login();
                mygetopid("WxOpenId",s_openid);
                SaveOpenid.setCookie("SYH_openId",s_openid,5/1440);
         }else{
            window.location.href= openurl;
         }
    };


    var _login = new wechat_login();
        _login.init();

    // var openid = true;
    // mygetopid("WxOpenId",openid)
    function mygetopid(item,openid){
        if(openid){
            window.openid=openid;
            if(window.main!=null){
              window.main(openid);
            }

        }
    };

})();