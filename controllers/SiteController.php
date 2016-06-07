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
    /**
     * register-test
     * 注册管理员接口测试程序
     */
    public function actionRegisterTest() {
        // 页面输出数据数组
        $renderArgs = [];
        // 要注册的管理员信息
        $data = [
            'username' => '666666',
            'password' => '123456',
        ];
        // 调用注册接口
        $res = Yii::$app->api->post('manager/register', $data);
        $renderArgs = $res;
        return $this->render('index', $renderArgs);
    }
    /**
     * search-test
     * 管理员列表
     * @return Ambigous <string, string>
     */
    public function actionSearchTest() {
        // 页面输出数据数组
        $renderArgs = [];
        $where = [
            'status'=>1
        ];
        $res = Yii::$app->api->get('manager/search', $where);
        $renderArgs = $res;
        return $this->render('index', $renderArgs);
    }
}
