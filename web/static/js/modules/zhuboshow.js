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