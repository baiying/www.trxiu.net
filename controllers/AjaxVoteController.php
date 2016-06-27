<?php
namespace app\controllers;
/**
 * 投票异步请求控制器
 */
use Yii;
use app\controllers\AjaxBaseController;

header("Access-Control-Allow-Origin:*");

class AjaxVoteController extends AjaxBaseController {
    /**
     * vote
     * 免费投一票
     * @param number $data['ballot_id']     活动ID，必填
     * @param number $data['anchor_id']     主播ID，必填
     * @param number $data['fans_id']       粉丝ID，必填
     */
    public function actionVote() {
        $rule = [
            'ballot_id' => ['type'=>'int', 'required'=>TRUE],
            'anchor_id' => ['type'=>'int', 'required'=>TRUE],
            'fans_id'   => ['type'=>'int', 'required'=>TRUE],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());
        $res = Yii::$app->api->post('vote/add', $args);
        if($res['code'] == 200) {
            $this->export('success', $res['message']);
        } else {
            $this->export('fail', $res['message']);
        }
    }
}