require.config({
    baseUrl: 'static/js/modules/',
    urlArgs: "bust=" +  (new Date()).getTime(),
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



    //绑定页面基础信息
    function bindBaseInfo(data){
        var title=data.ballot_name+"("+data.begin_time+"-"+data.end_time+")";
        $("#pHuoDongTitle").html(title);
    }

    //绑定主播列表信息
    function bindZhuBoList(data){
        var listHtml="";
        var dataList=data;
        for(var i=0;i<dataList.length;i++){
            var itemHtml=$("#tplItem").html();
            var indexIcon=""
            if(dataList[i].ranking<=3){
                indexIcon="n"+parseInt(dataList[i].ranking);
            }

            // debugger
            itemHtml=itemHtml.replace("{{index}}",indexIcon);
            itemHtml=itemHtml.replace("{{ballot_id}}",window.ballot_id);
            itemHtml=itemHtml.replace("{{anchor_id}}",dataList[i].anchor_id);
            itemHtml=itemHtml.replace("{{thumb}}",dataList[i].thumb);
            itemHtml=itemHtml.replace("{{anchor_name}}",dataList[i].anchor_name);
            itemHtml=itemHtml.replace("{{votes}}",dataList[i].votes);
            listHtml+=itemHtml;
        }
        $("#divZhuboList").append(listHtml);
    }


    //获取ajax数据
    function getAjax(){
        $.ajax({  
            type : "get",  
            url : config.apiHost+"ajax-ballot/get-valid-ballot/",
            data:{
                page:1,
                size:10
            },
            dataType:"json",
            success : function(resp) {

                if(resp.status=="success"){
                    window.ballot_id=resp.data.ballot.ballot_id;
                    
                    util.setCookie("ballot_id",resp.data.ballot.ballot_id,30);
                    bindBaseInfo(resp.data.ballot);
                    saveTime(resp.data.ballot);
                    bindZhuBoList(resp.data.anchors)
                    
                    //活动状态不是1则显示活动结束
                    if(resp.data.ballot.status==3){
                        $(".endIcon").show();
                    }
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

    // 保存活动的开始时间和结束时间;
    function saveTime(data){
        // var begin_time = '2016,' + data.begin_time.substr(0,2) + ',' + data.begin_time.substr(3,2);
        // var end_time = '2016,' + data.end_time.substr(0,2) + ',' + data.end_time.substr(3,2);
        var begin_timestamp = data.begin_timestamp;
        var end_timestamp = data.end_timestamp;
        // localStorage.setItem('begin_time', begin_time);
        // localStorage.setItem('end_time', end_time);
        localStorage.setItem('begin_timestamp', begin_timestamp);
        localStorage.setItem('end_timestamp', end_timestamp);
    }

	function main(){

		getAjax();
		nav.bind("zhubo");
	}


    login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })
	

})