require.config({
    baseUrl: 'static/js/modules/',
    paths: {
        zepto: '../libs/zepto.min',
        util: '../libs/util',
        navigation: '../libs/navigation',
        imgPreview: '../libs/imgPreview',
    },
    shim:{
        zepto: {exports: '$'}
    }       
});


require(["zepto","util","navigation","imgPreview"],function($,util,nav,imgPreview){

   



    

    //绑定主播基础信息
    function  bindInfo(dataInfo){

        $("#divThumb").html('<img src="'+dataInfo.thumb+'" />');
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
            $("#divYoukePanel").hide();
            $("#divZhuboPanel").show();
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



            //绑定动态照片列表
            var imageHtml="";
            var imageList=$.parseJSON(dataInfo.images);
            for(var j=0;j<imageList.length;j++){
                imageHtml+='<img src="'+imageList[j]+'"/>';
            }
            if(!!imageHtml){
                imageHtml='<div class="liimages">'+imageHtml+'</div>';
            }
            html=html.replace("{{imageHtml}}",imageHtml);


            //绑定评论html
            var pinglunHtml="";
            var plList=dataInfo.comment;
            for(var j=0;j<plList.length;j++){
                pinglunHtml+='  <div class="pli" commentId="'+plList[j].comment_id+'">\
                                    <font>'+plList[j].fans_name+'：</font>\
                                    <span>'+plList[j].content+'</span>\
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
            location.href="lapiao.html?zhuboid="+ util.getParams()["id"];
        })


        //我要拉票
        $("#btnLaPiao").click(function(){


            $("#divShare").show();

            //弹出遮罩层，分享如下页面
            //location.href="lapiaodetail.html?zhuboid="+ util.getParams()["id"];
        })


        //发布动态
        $("#btnAddEvents").click(function(){
            location.href="addEvents.html"
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
            var $box=$(this).closest(".replybox");
            var newsId=$box.attr("newsId");
            var replyCommentId=$box.attr("replyCommentId");
            var content=$box.find(".textbox").val();

            if(content.length<5){
                util.alert("评论字数不能少于5个");
                return;
            }

            $("#loading").show();
            $.ajax({  
                type : "post",  
                url : config.apiHost+"ajax-news/news-comment/",
                data:{
                    news_id:newsId,
                    openid:window.openid,
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



        




    }

    //获取页面数据
    function getAjaxData(callback){
        var params=util.getParams();
        $.ajax({  
            type : "post",  
            url : config.apiHost+"ajax-ballot/anchor-in-ballot/",
            data:{
                ballot_id:params["ballot_id"],
                anchor_id: params["anchor_id"],
            },
            dataType:"json",
            success : function(resp) {
                if(resp.status=="success"){
                    window.zhubopic=resp.data.thumb;
                    window.zhuboname=resp.data.name;
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

    function main(){
        getAjaxData(function(){
            $("#loading").hide();
            $(".page").show();
            getZhuBoEvents();
            nav.bind("zhubo");
        })
        bindPageEvents();
    }

    main();


})