require.config({
    baseUrl: 'static/js/modules/',
    urlArgs: "bust=" +  (new Date()).getTime(),
    paths: {
        zepto: '../libs/zepto.min',
        login: '../libs/login',
        util: '../libs/util',
        moxie: '../libs/moxie',
        plupload: '../libs/plupload.min',
        qiniu: '../libs/qiniu.min',
    },
    shim:{
        zepto: {exports: '$'},
        plupload: ["moxie"]
    }       
});


require(["zepto","login","util","moxie","plupload","qiniu"],function($,login,util,moxie,plupload,qiniu){
   

    


    
    //绑定上传事件
    function bindUploadEvents(){
        var uploader = Qiniu.uploader({
            runtimes: 'html5',
            browse_button: 'pickfiles',
            container: 'container',
            drop_element: 'container',
            max_file_size: '1000mb',
            flash_swf_url: 'bower_components/plupload/js/Moxie.swf',
            dragdrop: true,
            chunk_size: '4mb',
            multi_selection: true,
            //uptoken_url: 'http://wechat.trxiu.net/qiniu/ajax/?act=token',
            uptoken:$("#uptoken").val(),
            domain: 'http://o8syigvwe.bkt.clouddn.com/',
            get_new_uptoken: false,
            unique_names: true,
            auto_start: true,
            log_level: 5,
            init: {
                // 添加文件时的触发事件
                'FilesAdded': function(up, files) {
                    $("#loading").show();
                },
                // 开始上传前的触发事件
                'BeforeUpload': function(up, file) {
                    
                },
                // 上传进行中
                'UploadProgress': function(up, file) {
                    
                },
                // 上传结束时触发事件
                'UploadComplete': function() {
                   
                },
                // 上传结束后触发事件
                'FileUploaded': function(up, file, info) {

                    var imgHtml='<img src="http://o8syigvwe.bkt.clouddn.com/'+file.name+'" />';
                    $(".imglist").append(imgHtml)
                     $("#loading").hide();
                    
   
                   
                },
                // 异常事件
                'Error': function(up, err, errTip) {
                   
                }
            }
        });
    }



    function bindPageEvents(){

        var params=util.getParams();
        //发布动态
        $("#btnSubmit").click(function(){

            var imageList=[];
            $(".imglist img").each(function(){
                imageList.push($(this).attr("src"));
            })
            var content=$("#txtContent").val();
            $.ajax({  
                type : "post",  
                url : config.apiHost+"ajax-news/add-anchor-news/",
                data:{
                    openid: window.userInfo.openid,
                    content:content,
                    images:JSON.stringify(imageList)
                },
                dataType:"json",
                success : function(resp) {
                    if(resp.status=="success"){
                        location.href="zhuboshow.html?anchor_id="+ params["anchor_id"]+"&ballot_id="+params["ballot_id"];
                    }
                    else{
                        util.alert(resp.message);
                    }
                }
            });
        })
    }


    function getUpdateParams(){
        $.ajax({  
            type : "get",  
            url : "http://wechat.trxiu.net/qiniu/ajax/?act=token",
            dataType:"json",
            success : function(resp) {
                $("#uptoken").val(resp.uptoken);
                bindUploadEvents();
            }
        });
    }



    //页面主入口
    function main(){
        getUpdateParams();
        bindPageEvents();
    }
    

    login.init(function(userInfo){
        window.userInfo=userInfo;
        main();
    })

})












