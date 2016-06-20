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

    function  bindInfo(dataInfo){

        $("#divThumb").html('<img src="'+dataInfo.thumb+'" />');
        $("#divAnchorName").html(dataInfo.anchor_name);
        $("#divPlatform").html(dataInfo.platform);
        $("#divDescription").html(dataInfo.description);

        
    }


    function main(){
        getAjaxData(function(){
            $("#loading").hide();
            $(".page").show();

            nav.bind("zhubo");
        })
        bindInfo();
    }

    main();


})