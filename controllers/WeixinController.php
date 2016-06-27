<?php
namespace app\controllers;

use Yii;
use app\components\ApiCode;
use yii\web\Controller;

class WeixinController extends Controller {
    /**
     * 验证token
     */
    public function actionCheckToken() {
        $signature = Yii::$app->request->get('signature');
        $timestamp = Yii::$app->request->get('timestamp');
        $nonce = Yii::$app->request->get('nonce');
        $echostr = Yii::$app->request->get('echostr');
        
        $token = Yii::$app->weixin->getToken();
        $tmpArr = array($token, $timestamp, $nonce);
        // use SORT_STRING rule
        sort($tmpArr, SORT_STRING);
        $tmpStr = implode( $tmpArr );
        $tmpStr = sha1( $tmpStr );
        
        if( $tmpStr == $signature ){
            echo $echostr;
        }else{
            echo "";
        }
    }
    
}