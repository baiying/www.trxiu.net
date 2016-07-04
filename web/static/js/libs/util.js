define(function()
{
    var util={};

    function g$(id){
        return document.getElementById(id);
    }
    //获取url参数
    util.getParams=function(urls){
        var url=urls!=null?urls:window.location.href;
        var params={};
        url=url.split("?")[1];
        if(url!=null&&url!=""){
            var pList=url.split("&");
            for(var i=0;i<pList.length;i++){
                var pitem=pList[i].split("=");
                var key=pitem[0];
                params[key]=pList[i].replace(key+"=","");
            }
        }
        return params;
    }

    //将分转换成元
    util.parseYuan=function(value){
        var result=0;
        if(value/100!=parseInt(value/100)){
            result=(value/100).toFixed(2);
        }
        else{
            result=parseInt(value/100);
        }
        return result;
    }

    //保留小数点后N位,返回String类型
    util.parseNumber=function(value,digit)
    {
        var result= Math.round(parseFloat(value)*Math.pow(10,digit));   
        result=parseFloat(result/Math.pow(10,digit));
        return result.toFixed(digit);
    }

    //设置cookie
    util.setCookie=function(NameOfCookie, value, expiredays){ 
        var ExpireDate = new Date (); 
        ExpireDate.setTime(ExpireDate.getTime() + (expiredays * 24 * 3600 * 1000)); 
        document.cookie = NameOfCookie + "=" + escape(value) +  ((expiredays == null) ? "" : "; expires=" + ExpireDate.toGMTString()); 
    }

    //获取cookie
    util.getCookie=function(NameOfCookie){
        if (document.cookie.length > 0){ 
            begin = document.cookie.indexOf(NameOfCookie+"="); 
            if (begin != -1){ 
                begin += NameOfCookie.length+1;
                end = document.cookie.indexOf(";", begin);
                if (end == -1) {
                    end = document.cookie.length;
                }
                return unescape(document.cookie.substring(begin, end)); 
            }
        }
        return null; 
    }












    util.unMask=function(mskId)
    {
        var mask=null;
        if(mskId!=null){
            mask=g$(mskId);
        }
        else{
            mask=g$("mask");
        }
        (mask!=null)&&document.body.removeChild(mask);
    }

    util.mask=function()
    {
        var mask=document.createElement("div");
        mask.style.backgroundColor="#000000";
        mask.style.width="100%";
        mask.style.height="100%";
        mask.style.position="fixed";
        mask.style.zIndex=10000;
        mask.style.opacity="0.5";
        mask.style.left="0";
        mask.style.top="0";
        mask.id="mask";
        document.body.appendChild(mask);
        mask.addEventListener('touchmove', function(e){
             e.preventDefault&&e.preventDefault(); 
             e.stoppropagation&&e.stoppropagation();
        });
        return mask;
    }

    util.alert=function(str,callBack){
        var mskIndex=99999; 
        var msk=util.mask();
        msk.id="mask"+mskIndex;
        msk.style.zIndex=99998;
        var msgbox=document.createElement("div");
        msgbox.style.width="80%";
        msgbox.style.left="10%";
        msgbox.style.top="40%";
        msgbox.style.borderRadius="5px";
        msgbox.style.background="#ffffff";
        msgbox.style.position="fixed";
        msgbox.style.zIndex=mskIndex;
        msgbox.style.fontSize="12px";
        
        msgbox.id="msgbox";
        var html='\
            <div style=" padding:15px 15px; text-align:center;">'+str+'</div>\
            <div style="width:90%; height:1px; background:#cccccc; margin-left:5%;"></div>\
            <div id="spnCloseMsg" onClick="spnCloseMsg()" style="width:100%; padding:15px 0; text-align:center;"><span  style="padding:10px; font-size:14px; color:#2d7ac2">确定</span></div>\
        '; 
        msgbox.innerHTML=html;
        document.body.appendChild(msgbox);
        var marginTop=msgbox.clientHeight/2;
        msgbox.style.marginTop="-"+marginTop+"px";
        
        msgbox.addEventListener('touchmove', function(e){
             e.preventDefault&&e.preventDefault(); 
             e.stoppropagation&&e.stoppropagation();
        });
        
        window.spnCloseMsg=function()
        {
            var msgbox=g$("msgbox");
            if(g$("msgbox"))
            {
                document.body.removeChild(msgbox);
            }
            util.unMask(msk.id);
            if(callBack)
            {
                callBack();
            }
        }
    }







    return util;
})