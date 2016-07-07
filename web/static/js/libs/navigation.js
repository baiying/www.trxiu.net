define(['zepto','util'],function($,util){

	var nav={};


	nav.bind=function(item){




		
		var zhubohtml,xiaoxihtml,dajianghtml,guizehtml;
		zhubohtml='<a href="zhubolist.html"><span class="zhubo">主播</span></a>';
		xiaoxihtml='<a href="xiaoxi.html"><span class="xiaoxi">消息</span></a>';
		dajianghtml='<a href="dajiang.html"><span class="dajiang">大奖</span></a>';
		guizehtml='<a href="guize.html"><span class="guize">规则</span></a>';
		if(item=="zhubo"){
			zhubohtml='<a href="zhubolist.html" class="focus"><span class="zhubo">主播</span></a>';
		}
		else if(item=="xiaoxi"){
			xiaoxihtml='<a href="xiaoxi.html" class="focus"><span class="xiaoxi">消息</span></a>';
		}
		else if(item=="dajiang"){
			dajianghtml='<a href="dajiang.html" class="focus"><span class="dajiang">大奖</span></a>';
		}
		else if(item=="guize"){
			guizehtml='<a href="guize.html" class="focus"><span class="guize">规则</span></a>';
		}

		var navhtml=zhubohtml+dajianghtml+guizehtml+xiaoxihtml;
		$(".footer").html(navhtml);




		$.ajax({  
            type : "get",  
            url : config.apiHost+"ajax-message/get-count-unread-message/",
            data:{
                openid: window.userInfo.openid
            },
            dataType:"json",
            success : function(resp) {
            	console.log(resp)
                if(resp.status=="success"){
                	if(!!resp.data.countUnreadMessage&&resp.data.countUnreadMessage>0){
                		if($(".footer .xiaoxi").closest(".focus").length==0){
							$(".footer .xiaoxi").append('<b class="xiaoxiIcon">'+resp.data.countUnreadMessage+'</b>');
						}
                	}
                }
                else{
                    util.alert(resp.message);
                }
            }
        });
	}
	return nav;

})