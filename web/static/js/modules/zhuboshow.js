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


require(["zepto","login","util","navigation","imgPreview","jweixin"],function($,login,util,nav,imgPreview,wx){


    var isSelf=false;

    //绑定主播基础信息
    function  bindInfo(dataInfo){

        $("#divThumb").css({'background-image': 'url('+dataInfo.thumb+')'});//微信主播头像
        $("#divAnchorName").html(dataInfo.name);
        $("#divPlatform").html(dataInfo.platform);
        $("#divDescription").html(dataInfo.description);   

        $("#btnZhiBoJian").click(function(){
            location.href=dataInfo.broadcast;
        })

        if(dataInfo.isAnchor==false){   //如果不是主播本人
            $("#divYoukePanel").show();
            $("#divZhuboPanel").hide();
        }
        else{
            isSelf=true;
            $("#divYoukePanel").hide();
            $("#divZhuboPanel").show();
            $("#divZhuboText").show();
        }
    }


    function bindEventData(dataList){
        var listHtml="";

        for(var i=0;i<dataList.length;i++){
            var dataInfo=dataList[i];
            var html=$("#tplEventItem").html();
            html=html.replace("{{zhubopic}}",window.zhubopic);
            html=html.replace("{{nickName}}",window.zhuboname);
            html=html.replace("{{addedDate}}",dataInfo.create_time);

            html=html.replace("{{content}}",dataInfo.content);
            html=html.replace("{{comments}}",dataInfo.comment_total);
            html=html.replace("{{news_id}}",dataInfo.news_id);

            var deleteHtml="";
            if(isSelf==true){
                deleteHtml='<span class="btnDeleteNews">删除</span>';
            }
            html=html.replace("{{deleteHtml}}",deleteHtml);

            //绑定动态照片列表
            var imageHtml="";
            if(!!dataInfo.images){
                var imageList=$.parseJSON(dataInfo.images);
                for(var j=0;j<imageList.length;j++){
                    imageHtml+='<img src="'+imageList[j]+'?imageView2/1/w/500/h/500"/>';
                }
                if(!!imageHtml){
                    imageHtml='<div class="liimages">'+imageHtml+'</div>';
                }
            }
            html=html.replace("{{imageHtml}}",imageHtml);
            

            //绑定评论html
            var pinglunHtml="";
            var plList=dataInfo.comment;
            for(var j=0;j<plList.length;j++){

                var replyText="";
                if(!!plList[j].parent_fans_name){
                    replyText="<font style='color:#aaa'>回复"+plList[j].parent_fans_name+"</font>"
                }

                pinglunHtml+='  <div class="pli" commentId="'+plList[j].comment_id+'">\
                                    <font>'+plList[j].fans_name+'：</font>\
                                    <span>'+replyText+plList[j].content+'</span>\
                                </div>';
            }
            if(dataInfo.comment_total>5){
                pinglunHtml+='<div class="more">查看更多</div>';
            }

            
            if(!!pinglunHtml){
                pinglunHtml='<div class="lipinglun">'+pinglunHtml+'</div>';
            }
            html=html.replace("{{pinglunhtml}}",pinglunHtml);
            listHtml+=html;
        }
        $("#divDongtai").append(listHtml);
    }


    function bindPageEvents(){

        //投票
        $("#btnTouPiao").click(function(){
            var params=util.getParams();
            // location.href="lapiao.html?anchor_id="+ params["anchor_id"]+"&ballot_id="+params["ballot_id"];
            // util.alert('萌主派对投票活动暂未开放，敬请期待!')
            
            var begin_time = localStorage.getItem('begin_timestamp')*1000;
            var end_time = localStorage.getItem('end_timestamp')*1000;
            var time = +new Date();

            if (time > begin_time && time < end_time) {
                location.href="lapiao.html?anchor_id="+ params["anchor_id"]+"&ballot_id="+params["ballot_id"];
            }else{
                util.alert('萌主派对投票活动暂未开放，敬请期待!')
            }
        })

        //我要拉票
        $("#btnLaPiao").click(function(){

            var begin_time = localStorage.getItem('begin_timestamp');
            var end_time = localStorage.getItem('end_timestamp');
            var time = +new Date();
            
            if (time > begin_time*1000 && time < end_time*1000) {
                $("#divShare").show();
                // 弹出遮罩层，分享如下页面
                // location.href="lapiaodetail.html?anchor_id="+ util.getParams()["anchor_id"] + '&ballot_id=' + util.getParams()["ballot_id"];
            }else{
                util.alert('萌主派对投票活动暂未开放，敬请期待!')
            }


        })


        //发布动态
        $("#btnAddEvents").click(function(){
            var params=util.getParams();
            location.href="addEvents.html?anchor_id="+ params["anchor_id"]+"&ballot_id="+params["ballot_id"];
        })

        //删除动态
        $("body").on("click",".btnDeleteNews",function(){
            var newsId=$(this).closest(".li").attr("news_id");
            if(window.confirm("确定要删除吗？")){
                 $("#loading").show();
                $.ajax({  
                    type : "post",  
                    url : config.apiHost+"ajax-news/del-news/",
                    data:{
                        news_id:newsId,
                        openid:window.userInfo.openid
                    },
                    dataType:"json",
                    success : function(resp) {
                        if(resp.status=="success"){
                            location.reload();
                        }
                        else{
                            util.alert(resp.message);
                        }
                    },
                    complete:function(){
                         $("#loading").hide();
                    }
                });
            }

            
        })

        //预览图片
        $("body").on("click",".liimages img",function(){
            var url=$(this).attr("src");
            imgPreview.show(url)
        })


        //关闭遮罩层
        $(".mask").click(function(){
            $(this).hide();
        })


        //查看评论
        $("body").on("click","#divDongtai>.li .more",function(){
            var newsId=$(this).closest(".li").attr("news_id");
            location.href="pinglunshow.html?news_id="+newsId;
        })


        //关闭回复面板
        $("body").on("click",".replybox",function(ev){

            if($(ev.srcElement).closest(".innerbox").length==0){
               $(".replybox").remove();
            }
            else if($(ev.srcElement).hasClass("btnReClose")){
                $(".replybox").remove();
            }
        })


        //展示评论面板
        $("body").on("click","#divDongtai>.li .btnshowReplyBox",function(){
            var newsId=$(this).closest(".li").attr("news_id");

            var replyboxHtml=$("#tplReplyBox").html();
            var replyCommentId="";
            replyboxHtml=replyboxHtml.replace("{{newsId}}",newsId);
            replyboxHtml=replyboxHtml.replace("{{replyCommentId}}",replyCommentId);
            if($(".replybox").length>0){
                $(".replybox").remove();
            }
            $("body").append(replyboxHtml);
        })

        //展示回复评论面板
        $("body").on("click","#divDongtai>.li .pli",function(){
            var newsId=$(this).closest(".li").attr("news_id");
            var replyboxHtml=$("#tplReplyBox").html();
            var replyCommentId=$(this).attr("commentId");
            replyboxHtml=replyboxHtml.replace("{{newsId}}",newsId);
            replyboxHtml=replyboxHtml.replace("{{replyCommentId}}",replyCommentId);
            if($(".replybox").length>0){
                $(".replybox").remove();
            }
            $("body").append(replyboxHtml);
        })

        
        //提交评论信息
        $("body").on("click",".replybox .btnReSave",function(){
            if(!$(this).hasClass("enable")){
                return;
            }
            var $box=$(this).closest(".replybox");
            var newsId=$box.attr("newsId");
            var replyCommentId=$box.attr("replyCommentId");
            var content=$box.find(".textbox").val();

            if(content.length<1){
                util.alert("评论内容不能为空");
                return;
            }

            $("#loading").show();
            $.ajax({  
                type : "post",  
                url : config.apiHost+"ajax-news/news-comment/",
                data:{
                    news_id:newsId,
                    openid:window.userInfo.openid,
                    parent_comment_id:replyCommentId,
                    content:content,
                },
                dataType:"json",
                success : function(resp) {
                    if(resp.status=="success"){
                        location.reload();

                        $(".replybox").remove();
                    }
                    else{
                        util.alert(resp.message);
                    }
                },
                complete:function(){
                     $("#loading").hide();
                }
            });
        })

        $("body").on("input",".textbox",function(){
            var value=$(this).val();
            if(value.length>=1){
                $(".replybox .btnReSave").addClass("enable");
            }
            else{
                $(".replybox .btnReSave").removeClass("enable");
            }
        })



    }

    //获取页面数据
    function getAjaxData(callback){
        var params=util.getParams();
        $.ajax({  
            type : "get",  
            url : config.apiHost+"ajax-ballot/anchor-in-ballot/",
            data:{
//                ballot_id:util.getCookie("ballot_id"),
                ballot_id:params["anchor_id"],
                anchor_id: params["anchor_id"],
                openid:window.userInfo.openid
            },
            dataType:"json",
            success : function(resp) {
                if(resp.status=="success"){
                    window.zhubopic=resp.data.thumb;
                    window.zhuboname=resp.data.name;
                    window.shareImage=resp.data.ShareImg;
                    window.ShareTitle=resp.data.ShareTitle;
                    window.ShareDescripion=resp.data.ShareDescripion;



                    bindInfo(resp.data);
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

    //获取主播动态信息
    function getZhuBoEvents(){

        $.ajax({  
            type : "get",  
            url : config.apiHost+"ajax-news/get-anchor-news/",
            data:{
                anchor_id: util.getParams()["anchor_id"],
                size:100
            },
            dataType:"json",
            success : function(resp) {
                if(resp.status=="success"){
                    bindEventData(resp.data.list)
                }
                else{
                    util.alert(resp.message);
                }
            }
        });
    }



    //绑定分享信息
    function bindShareInfo(){
        var params=util.getParams();
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
                            imgUrl :window.shareImage,
                            success:function(){
                                 $("#divShare").hide();
                            }
                        });

                        //分享给朋友
                        wx.onMenuShareAppMessage({
                            title :window.ShareTitle,
                            desc : window.ShareDescripion,
                            link :config.currentDomain+"lapiaodetail.html?anchor_id="+ params["anchor_id"]+"&ballot_id="+params["ballot_id"],
                            imgUrl:window.shareImage,
                            success:function(){
                                 $("#divShare").hide();
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




    function main(){
        
        getAjaxData(function(){
            bindShareInfo();
            $("#loading").hide();
            $(".page").show();
            getZhuBoEvents();
            nav.bind("zhubo");
        })
        bindPageEvents();
    }

    login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })
    
})