<?php
/**
 * 消息控制器
 */

namespace app\controllers;

use Yii;
use app\controllers\AjaxBaseController;

header("Access-Control-Allow-Origin:*");

class AjaxMessageController extends AjaxBaseController
{

    /**
     * get-message-list
     * 获取消息列表
     */
    public function actionGetMessageList(){

        $rule = [
            'openid' => ['type'=>'string', 'required'=>true],
            'page' => ['type'=>'int', 'required'=>false,'default'=>1],
            'size' => ['type'=>'int', 'required'=>false,'default'=>20],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());

        $openid = $args['openid'];
        $code = Yii::$app->api->get('fans/get-fans-info-by-openid',['openid'=>$openid]);
        if($code['code'] != 200) {
            $this->export('fail', $code['message']);
        }
        $commentWhere['fans_id'] = $code['data']['fans_id'];
        $commentWhere['page'] = $args['page'];
        $commentWhere['size'] = $args['size'];

        // 获取当前有效的活动
        $res = Yii::$app->api->get('message/get-message-list-by-fans-id', $commentWhere);
        if($res['code'] == 200) {
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }

    /**
     * get-message-by-id
     * 读取消息
     */
    public function actionGetMessageById(){

        $rule = [
            'openid' => ['type'=>'string', 'required'=>true],
            'message_id' => ['type'=>'int', 'required'=>true]
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());

        $openid = $args['openid'];
        $code = Yii::$app->api->get('fans/get-fans-info-by-openid',['openid'=>$openid]);
        if($code['code'] != 200) {
            $this->export('fail', $code['message']);
        }
        $commentWhere['fans_id'] = $code['data']['fans_id'];
        $commentWhere['message_id'] = $args['message_id'];

        // 获取当前有效的活动
        $res = Yii::$app->api->get('message/get-message-by-id', $commentWhere);
        if($res['code'] == 200) {
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }

    /**
     * add-message
     * 发送消息
     */
    public function actionAddMessage(){

        $rule = [
            'openid' => ['type'=>'string', 'required'=>true],
            'content' => ['type'=>'string', 'required'=>true],
            'receive_fans_id' => ['type'=>'int', 'required'=>true],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());

        $openid = $args['openid'];
        $code = Yii::$app->api->get('fans/get-fans-info-by-openid',['openid'=>$openid]);
        if($code['code'] != 200) {
            $this->export('fail', $code['message']);
        }
        $comment['send_fans_id'] = $code['data']['fans_id'];
        $comment['content'] = $args['content'];
        $comment['receive_fans_id'] = $args['receive_fans_id'];

        // 获取当前有效的活动
        $res = Yii::$app->api->post('message/add-message', $comment);
        if($res['code'] == 200) {
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }
    
    
}