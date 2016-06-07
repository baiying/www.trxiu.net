<?php

namespace app\controllers;

use Yii;
use yii\filters\AccessControl;
use yii\web\Controller;
use app\controllers\BaseController;

class SiteController extends BaseController {

    public $layout = "main";
    
    public function actionIndex() {
            // 如果cookie中已存在openid
    //         $cookies = Yii::$app->request->cookies;
    //         if($cookies->has('openid')) {
    //             var_dump($cookies->getValue('openid'));
    //             exit;
    //         }
        // 生成授权地址，并自动跳转到该地址上
        $redirect = [
            'redirect_url'=>'http://admin.e2047.com/site/get-oauth-token/',
            'state'=>'oauth-redirect',
            'scope'=>'snsapi_userinfo'
        ];
        $res = Yii::$app->api->get('weixin/get-oauth-redirect-url', $redirect);
        if($res['code'] == 200) {
            header("Location:".$res['data']['authUrl']);
            exit;
        } else {
            $renderArgs = [];
            $this->errors[] = $res['message'];
            return $this->render('index');
        }
    }
    
    public function actionGetOauthToken() {
        $renderArgs = [];
        $rule = [
            'code' => ['type' => 'string', 'required' => TRUE, 'default' => ''],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());
        // 用code换取access_token
        $res = Yii::$app->api->get('weixin/oauth-access-token', $args);
        if($res['code'] == 200) {
//             $renderArgs['data'] = $res['data'];
            $accessToken = $res['data']['access_token'];
            $openId = $res['data']['openid'];
            // 获取用户微信资料
            $res = Yii::$app->api->get('weixin/oauth-user-info', ['access_token'=>$accessToken, 'openid'=>$openId]);
            $renderArgs['data'] = $res['data'];
            // 将openid存入到cookie中
            $cookies = Yii::$app->response->cookies;
            $cookies->add(new \yii\web\Cookie([
                'name' => 'openid',
                'value' => $res['data']['openid']
            ]));
        } else {
            $this->errors[] = $res['message'];
        }
        return $this->render('index', $renderArgs);
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
