<?php
namespace app\controllers;
/**
 * 用户账号信息异步请求控制器
 */
use Yii;
use app\controllers\AjaxBaseController;

class AjaxAccountController extends AjaxBaseController {
    /**
     * get-user-info
     * 获取用户登录信息
     * @return array
     * 返回结果中的data内容如果为空数组，则表示用户并未登录，如果data不空，则用户已登录
     * 用户登录信息包括：微信账号的openid，本系统中的fansid，用户头像thumb，用户昵称name
     */
    public function actionGetUserInfo() {
        if(Yii::$app->cookie->has('fans')) {
            list($openid, $name, $thumb, $fansid) = explode("|", Yii::$app->cookie->getValue('fans'));
            $arr = [
                'openid' => $openid,
                'fansid' => $fansid,
                'thumb'  => $thumb,
                'name'   => $name,
            ];
            $this->export('success', '获取用户信息成功', $arr);
        
        } else {
            $this->export('success', '获取用户信息失败，用户未登录');
        }
    }
    /**
     * login-by-code
     * 通过微信code获取用户信息
     * 用户信息包括：微信账号的openid，本系统中的fansid，用户头像thumb，用户昵称name
     */
    public function actionLoginByCode() {
        $rule = [
            'code' => ['type'=>'string', 'required'=>TRUE]
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());
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
            // 返回用户信息
            $this->export('success', '获取用户信息成功', [
                'openid' => $data['openid'],
                'name'      => $data['nickname'],
                'fansid'    => $fansId,
                'thumb'     => $data['headimgurl']
            ]);
        
        } else {
            $this->export('fail', $res['message']);
        }
    }
}