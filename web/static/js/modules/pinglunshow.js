require.config({
    baseUrl: 'static/js/modules/',
    paths: {
        zepto: '../libs/zepto.min',
        login: '../libs/login',
        util: '../libs/util',
        navigation: '../libs/navigation',
    },
    shim:{
        zepto: {exports: '$'}
    }       
});


require(["zepto","login","util","navigation"],function($,login,util,nav){

    



    function bindPageInfo(dataInfo){

        $("#divZhuboPic").html('<img src="'+dataInfo.anchor.thumb+'">');
        $("#divZhuboName").html(dataInfo.anchor.anchor_name);
        $("#divCreateTime").html(dataInfo.create_time);
        $("#divEventContent").html(dataInfo.content);

        var imageHtml="";
        var imgList=$.parseJSON(dataInfo.images);
        for(var i=0;i<imgList.length;i++){
            imageHtml+='<img src="'+imgList[i]+'?imageView2/1/w/500/h/500" />'
        }
        $("#divImageList").html(imageHtml);
        $("#divCommentCount").html(dataInfo.comments);


        var pinglunHtml="";
        var plList=dataInfo.commentList;
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

        $("#divPLHtml").append(pinglunHtml);

        
    }




    //获取页面数据
    function getAjaxData(callback){
        var params=util.getParams();
        $.ajax({  
            type : "get",  
            url : config.apiHost+"ajax-news/get-news-comment-list/",
            data:{
                news_id:params["news_id"]
            },
            dataType:"json",
            success : function(resp) {
                if(resp.status=="success"){
                    bindPageInfo(resp.data);
                }
                else{
                    util.alert(resp.message);
                }
            },
            complete:function(){
                $("#loading").hide();
                if(!!callback){
                    callback();
                }
                
            }
        });
    }

    function bindPageEvents(){

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
        $("body").on("click","#divCommentCount",function(){
            

            var newsId= util.getParams()["news_id"];

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
            var newsId=util.getParams()["news_id"];
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





	//
	function main(){
		getAjaxData();
        bindPageEvents();
		nav.bind("zhubo");
	}
	
    login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })

})