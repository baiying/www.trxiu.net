require.config({
    baseUrl: 'static/js/modules/',
    paths: {
        zepto: '../libs/zepto.min',
        login: '../libs/login',
        util: '../libs/util'
    },
    shim:{
        zepto: {exports: '$'}
    }       
});


require(["zepto","login","util"],function($,login,util){

   
    var params=util.getParams();



    function bindPageInfo(){



        //绑定主播信息
        $.ajax({  
            type : "get",  
            url : config.apiHost+"ajax-ballot/anchor-in-ballot/",
            data:{
                ballot_id: params["ballot_id"],
                anchor_id: params["anchor_id"],
                openid: window.userInfo.openid
            },
            dataType:"json",
            success : function(resp) {

                if(resp.status=="success"){
                    $("#divZhuboPic").html('<img class="img" src="'+resp.data.thumb+'" />');
                    $("#divZhuboName").html(resp.data.name);
                    $("#divVoteCount").html(resp.data.vote+"票");
                }
                else{
                    util.alert(resp.message);
                }
            }
        });


        //绑定大奖信息
        $.ajax({  
            type : "get",  
            url : config.apiHost+"ajax-ballot/ballot-prize/",
            data:{
                ballot_id: params["ballot_id"]
            },
            dataType:"json",
            success : function(resp) {

                if(resp.status=="success"){

                    var html=resp.data.ballot_name+'（'+resp.data.begin_time+'-'+resp.data.end_time+'）';
                    $("#pHuoDongTitle").html(html);
                    var dataList=resp.data.parizeList;
                    var listHtml="";
                    for(var i=0;i<dataList.length;i++){
                        var itemHtml=$("#tplItem1").html();
                        var sort="";
                        if(dataList[i].sort<=3){
                            sort="n"+dataList[i].sort
                        }
                        itemHtml=itemHtml.replace("{{sort}}",sort);
                        itemHtml=itemHtml.replace("{{logo}}",dataList[i].logo);
                        itemHtml=itemHtml.replace("{{level}}",dataList[i].level);
                        itemHtml=itemHtml.replace("{{title}}",dataList[i].title);
                        itemHtml=itemHtml.replace("{{image}}",dataList[i].image);
                        listHtml+=itemHtml;
                    }
                    $("#divList").html(listHtml);
                }
                else{
                    util.alert(resp.message);
                }
            }
        });


    }
	


    function bindPageEvents(){

        $("#btnTouPiao").click(function(){
            location.href="zhuboshow.html?anchor_id="+ params["anchor_id"]+"&ballot_id="+params["ballot_id"];
        })


    }

	function main(){
		
		bindPageInfo();
        bindPageEvents();
	}
	login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })

})