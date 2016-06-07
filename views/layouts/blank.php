<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9"> <![endif]-->
<!--[if !IE]><!--> <html lang="en"> <!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
	<meta charset="utf-8" />
	<title>Metronic | Login Page</title>
	<meta content="width=device-width, initial-scale=1.0" name="viewport" />
	<meta content="" name="description" />
	<meta content="" name="author" />
	<!-- BEGIN GLOBAL MANDATORY STYLES -->
	<link href="/media/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>
	<link href="/media/css/bootstrap-responsive.min.css" rel="stylesheet" type="text/css"/>
	<link href="/media/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>
	<link href="/media/css/style-metro.css" rel="stylesheet" type="text/css"/>
	<link href="/media/css/style.css" rel="stylesheet" type="text/css"/>
	<link href="/media/css/style-responsive.css" rel="stylesheet" type="text/css"/>
	<link href="/media/css/default.css" rel="stylesheet" type="text/css" id="style_color"/>
	<link href="/media/css/uniform.default.css" rel="stylesheet" type="text/css"/>
	<!-- END GLOBAL MANDATORY STYLES -->
	<!-- BEGIN PAGE LEVEL STYLES -->
	<link href="/media/css/login.css" rel="stylesheet" type="text/css"/>
	<!-- END PAGE LEVEL STYLES -->
	<link rel="shortcut icon" href="/media/image/favicon.ico" />
</head>
<!-- END HEAD -->
<!-- BEGIN BODY -->
<body class="login">

	<?php echo $content;?>
	
	<!-- BEGIN COPYRIGHT -->
	<div class="copyright">
		<script>document.write((new Date()).getFullYear());</script> &copy; SHOW by show.com.
	</div>
	<!-- END COPYRIGHT -->
	<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->
	<!-- BEGIN CORE PLUGINS -->
    <script src="/media/js/jquery-1.10.1.min.js" type="text/javascript"></script>
    <script src="/media/js/jquery-migrate-1.2.1.min.js" type="text/javascript"></script>
    <script src="/media/js/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>
    <script src="/media/js/bootstrap.min.js" type="text/javascript"></script>
    <!--[if lt IE 9]>
    <script src="/media/js/excanvas.min.js"></script>
    <script src="/media/js/respond.min.js"></script>  
    <![endif]-->   
    <script src="/media/js/jquery.slimscroll.min.js" type="text/javascript"></script>
    <script src="/media/js/jquery.blockui.min.js" type="text/javascript"></script>  
    <script src="/media/js/jquery.cookie.min.js" type="text/javascript"></script>
    <script src="/media/js/jquery.uniform.min.js" type="text/javascript" ></script>
    <!-- END CORE PLUGINS -->
    
    <!-- BEGIN PAGE LEVEL SCRIPTS -->
    <script src="/media/js/app.js" type="text/javascript"></script>
    <?php if(!empty($this->context->js)):?>
    <?php   foreach($this->context->js as $js):?>
    <script src="<?php echo $js?>" type="text/javascript" ></script>
    <?php   endforeach;?>
    <?php endif;?>
    <!-- END PAGE LEVEL SCRIPTS -->  
    <script>
        jQuery(document).ready(function() {    
            App.init(); // initlayout and core plugins
            <?php if(!empty($this->context->jsObject)):?>
            <?php   foreach($this->context->jsObject as $jsObject):?>
            <?php     echo $jsObject.".init();\n"?>
            <?php   endforeach;?>
            <?php endif;?>
        });
    </script>
    <!-- END JAVASCRIPTS -->
<!-- END BODY -->
</html>