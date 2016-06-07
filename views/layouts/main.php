<?php
use yii\helpers\Html;
?>
<?php $this->beginPage() ?>
<!DOCTYPE html>
<!--[if IE 8]> <html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]> <html lang="en" class="ie9 no-js"> <![endif]-->
<!--[if !IE]><!--> <html lang="zh-CN" class="no-js"> <!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
    <meta charset="utf-8" />
    <title>66汽配管理系统</title>
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <meta content="" name="description" />
    <meta content="" name="author" />
    <meta name="robots" content="nofollow" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <meta content="yes" name="apple-mobile-web-app-capable" />
    <meta content="black" name="apple-mobile-web-app-status-bar-style" />
    <meta content="telephone=no" name="format-detection" />
    <link rel="apple-touch-icon-precomposed" href="/media/image/66pei512png_b.png" >
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
    <?php if(!empty($this->context->css)):?>
    <?php   foreach($this->context->css as $css):?>
    <link href="<?php echo $css?>" rel="stylesheet" type="text/css"/>
    <?php   endforeach;?>
    <?php endif;?>
    <!-- END PAGE LEVEL STYLES -->  
    <link rel="shortcut icon" href="/media/image/favicon.ico" />
</head>
<!-- END HEAD -->
<!-- BEGIN BODY -->
<body class="page-header-fixed page-sidebar-fixed page-sidebar-closed">
<?php $this->beginBody() ?>
    <!-- BEGIN HEADER -->
    <div class="header navbar navbar-inverse navbar-fixed-top">
        <!-- BEGIN TOP NAVIGATION BAR -->
        <div class="navbar-inner">
            <div class="container-fluid">
                <!-- BEGIN LOGO -->
                <a class="brand" href="/">
                <img src="/media/image/logo.png" alt="logo"/>
                </a>
                <!-- END LOGO -->
                <!-- BEGIN RESPONSIVE MENU TOGGLER -->
                <a href="javascript:;" class="btn-navbar collapsed" data-toggle="collapse" data-target=".nav-collapse">
                <img src="/media/image/menu-toggler.png" alt="" />
                </a>          
                <!-- END RESPONSIVE MENU TOGGLER -->            
                <!-- BEGIN TOP NAVIGATION MENU -->              
                <ul class="nav pull-right">
                    <!-- BEGIN USER LOGIN DROPDOWN -->
                    <li class="dropdown user">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown">
                        <img alt="" src="http://p.cheweixiu.net/p/others/default/thumb/login30.png" />
                        <span class="username"><?php echo "测试";?></span>
                        <i class="icon-angle-down"></i>
                        </a>
                        <ul class="dropdown-menu">
                            <li><a href="/console/account/site/change-pwd/"><i class="icon-user"></i> 修改密码</a></li>
                            <li><a href="/console/account/site/logout/"><i class="icon-key"></i> 退出</a></li>
                        </ul>
                    </li>
                    <!-- END USER LOGIN DROPDOWN -->
                </ul>
                <!-- END TOP NAVIGATION MENU --> 
            </div>
        </div>
        <!-- END TOP NAVIGATION BAR -->
    </div>
    <!-- END HEADER -->
    <!-- BEGIN CONTAINER -->
    <div class="page-container row-fluid">
        <!-- BEGIN SIDEBAR -->
        <div class="page-sidebar nav-collapse collapse">
            <!-- BEGIN SIDEBAR MENU -->        
            <ul class="page-sidebar-menu">
                <li>
                    <!-- BEGIN SIDEBAR TOGGLER BUTTON -->
                    <div class="sidebar-toggler hidden-phone"></div>
                    <!-- BEGIN SIDEBAR TOGGLER BUTTON -->
                </li>
                <li class="active">
                    <a href="<?php echo $this->context->buildUrl("account/site");?>">
                    <i class="icon-home"></i> 
                    <span class="title">首页</span>
                    <span class="selected"></span>
                    </a>
                </li>
                <li class="">
                    <a href="javascript:;">
                        <i class="icon-flag"></i> 
                        <span class="title">活动管理</span>
                        <span class="arrow active"></span>
                    </a>
                    <ul class="sub-menu">
                        <li class="">
                            <a href="#">投票管理</a>
                        </li>
                        <li class="">
                            <a href="#">主播管理</a>
                        </li>
                    </ul>
                </li>
                <li class="">
                    <a href="javascript:;">
                        <i class="icon-yen"></i> 
                        <span class="title">财务管理</span>
                        <span class="arrow active"></span>
                    </a>
                    <ul class="sub-menu">
                        <li class="">
                            <a href="#">流水账</a>
                        </li>
                        <li class="">
                            <a href="#">账务统计</a>
                        </li>
                    </ul>
                </li>
                <li class="">
                    <a href="javascript:;">
                        <i class="icon-cog"></i> 
                        <span class="title">系统管理</span>
                        <span class="arrow active"></span>
                    </a>
                    <ul class="sub-menu">
                        <li class="">
                            <a href="#">账号管理</a>
                        </li>
                    </ul>
                </li>
            </ul>
            <!-- END SIDEBAR MENU -->
        </div>
        <!-- END SIDEBAR -->
        <!-- BEGIN PAGE -->
        <div class="page-content">
            <!-- BEGIN PAGE CONTAINER-->
            <div class="container-fluid">
                
                <?php echo $content; ?>
                
            </div>
            <!-- END PAGE CONTAINER-->    
        </div>
        <!-- END PAGE -->
    </div>
    <!-- END CONTAINER -->
    <!-- BEGIN FOOTER -->
    <div class="footer">
        <div class="footer-inner">
            <script>document.write((new Date()).getFullYear());</script> &copy; 66PEI by 66pei.com.
        </div>
        <div class="footer-tools">
            <span class="go-top">
            <i class="icon-angle-up"></i>
            </span>
        </div>
    </div>
    <!-- END FOOTER -->
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
<?php $this->endBody() ?>
</body>
<!-- END BODY -->
</html>
<?php $this->endPage() ?>
