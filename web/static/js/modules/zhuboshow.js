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
                console.log(resp)
                if(resp.status=="success"){
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

    function main(){
        getAjaxData(function(){
            $("#loading").hide();
            $(".page").show();
           // getEvents(0)
            nav.bind("zhubo");
        })
        bindPageEvents();
    }

    main();


})