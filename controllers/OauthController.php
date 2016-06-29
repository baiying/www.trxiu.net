<?php
namespace app\controllers;

use Yii;
use yii\web\Controller;

class OauthController extends Controller {
    /**
     * 获取当前访客信息
     * @return Ambigous <string, string>
     */
    public function actionGetUserInfo() {
        if(Yii::$app->cookie->has('fans')) {
            header('Location:'.Yii::$app->homeUrl);
            exit;
        }
        $renderArgs = [];
        $fansId = 0;
        $args = [
            'code' => Yii::$app->request->get('code')
        ];
        var_dump($args);exit;
        // 用code换取access_token
        $res = Yii::$app->api->get('weixin/oauth-access-token', $args);
        if($res['code'] == 200) {
            $accessToken = $res['data']['access_token'];
            $openId = $res['data']['openid'];
            $refreshToken = $res['data']['refresh_token'];
            $expiresIn = $res['data']['expires_in'];
            // 获取用户微信资料
            $res = Yii::$app->api->get('weixin/oauth-user-info', ['access_token'=>$accessToken, 'openid'=>$openId]);
            $data = $res['data'];
            $data['access_token'] = $accessToken;
            $data['refresh_token'] = $refreshToken;
            $data['expires_in'] = $expiresIn;
            unset($data['privilege']);
            // 用户信息入库，如果用户已注册为粉丝，则接口会直接返回粉丝ID
            $resReg = Yii::$app->api->post('fans/register', $data);
            $fansId = $resReg['data']['fans_id'];
            // 将用户资料存入到cookie中
            Yii::$app->cookie->setValue([
                'name'    => 'fans',
                'value'   => $data['openid']."|".$data['nickname']."|".$data['headimgurl']."|".$fansId,
                'expire'  => time()+7200
            ]);
            // 获取授权跳转前页面地址，如果不存在则跳转到活动首页
            if(Yii::$app->cookie->has('backurl')) {
                $backUrl = Yii::$app->cookie->getValue('backurl');
                header("Location:" . $backUrl);
                exit;
            } else {
                header("Location:" . Yii::$app->homeUrl);
                exit;
            }
            
        } else {
            $this->errors[] = $res['message'];
        }
        return $this->render('index', $renderArgs);
    }
}