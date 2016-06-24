require.config({
    baseUrl: 'static/js/modules/',
    paths: {
        zepto: '../libs/zepto.min',
        util: '../libs/util',
        navigation: '../libs/navigation',
    },
    shim:{
        zepto: {exports: '$'}
    }       
});


require(["zepto","util","navigation"],function($,util,nav){

   



    //获取页面数据
    function getAjaxData(callback){
        $.ajax({  
            type : "get",  
            //url : config.apiHost+"anchor/getanchorinformation",
            url : config.apiHost+"json/zhuboshow.aspx",
            data:{
                anchor_id: util.getParams()["id"],
            },
            dataType:"json",
            success : function(resp) {
                if(resp.code==200){
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

    //绑定主播基础信息
    function  bindInfo(dataInfo){

        $("#divThumb").html('<img src="'+dataInfo.thumb+'" />');
        $("#divAnchorName").html(dataInfo.anchor_name);
        $("#divPlatform").html(dataInfo.platform);
        $("#divDescription").html(dataInfo.description);
    }



    function bindEventData(dataList){
        var listHtml="";

        for(var i=0;i<dataList.length;i++){
            var dataInfo=dataList[i];
            var html=$("#tplEventItem").html();
            html=html.replace("{{content}}",dataInfo.content);
            html=html.replace("{{comments}}",dataInfo.comments);


        
            listHtml+=html;
        }

        $("#divDongtai").append(listHtml);

        //return html;
    }

    //获取主播动态
    function getEvents(page){
         $.ajax({  
            type : "get",  
            //url : config.apiHost+"news/getanchornews",
            url : config.apiHost+"json/getanchornews.aspx",
            data:{
                anchor_id: util.getParams()["id"],
            },
            dataType:"json",
            success : function(resp) {
                if(resp.code==200){
                    bindEventData(resp.data.list)
                }
                else{
                    util.alert(resp.message);
                }
                
            }
        });
    }


    function bindPageEvents(){

        //投票
        $("#btnTouPiao").click(function(){
            location.href="lapiaodetail.html?zhuboid="+ util.getParams()["id"];
        })


        //我要拉票
        $("#btnLaPiao").click(function(){
            
        })
    }



    function main(){
        getAjaxData(function(){
            $("#loading").hide();
            $(".page").show();
            getEvents(0)
            nav.bind("zhubo");
        })
        bindPageEvents();
    }

    main();


})