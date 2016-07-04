define(['zepto','util'],function($,util){

	var imgPreview={};
	imgPreview.show=function(url){

		var html='<div class="maskimage"><img src="'+url+'" /></div>'
		$("body").append(html);
	}

	$("body").on("click",".maskimage",function(){
		$(".maskimage").remove();
	})

	
	return imgPreview;

})