require.config({
    baseUrl: 'static/js/modules/',
    paths: {
        zepto: '../libs/zepto.min',
        util: '../libs/util'
    },
    shim:{
        zepto: {exports: '$'}
    }       
});


require(["zepto","util"],function($,util){

   



    //
    function bindPageInfo(){}
	


    function bindPageEvents(){

        $("#btnTouPiao").click(function(){
            location.href="zhuboshow.html?zhuboid="+util.getParams()["zhuboid"];;
        })


    }

	function main(){
		
		bindPageInfo();
        bindPageEvents();
	}
	main();

})