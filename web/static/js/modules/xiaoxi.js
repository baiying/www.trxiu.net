require.config({
    baseUrl: 'static/js/modules/',
    paths: {
        zepto: '../libs/zepto.min',
        util: '../libs/util',
        navigation: '../libs/navigation',
        login: '../libs/login',
    },
    shim:{
        zepto: {exports: '$'}
    }       
});


require(["zepto","util","navigation","login"],function($,util,nav,login){

   

	//
	function main(){
		
		nav.bind("xiaoxi");
	}
	main();

})