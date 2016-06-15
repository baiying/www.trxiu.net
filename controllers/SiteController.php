<?php

namespace app\controllers;

use Yii;
use yii\web\Controller;
use app\controllers\BaseController;

class SiteController extends BaseController {

    public $layout = "main";
    
    public function actionIndex() {
        return $this->render('index');
    }
    
    public function actionLogin() {
        if(Yii::$app->request->isPost) {
            var_dump(Yii::$app->request->post());
            exit;
        }
        $this->layout = "blank";
        $this->css[] = "/media/css/login.css";
        
        return $this->render('login');
    }
}
