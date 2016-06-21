<?php
namespace app\controllers;
/**
 * 投票活动异步请求控制器
 */
use Yii;
use app\controllers\AjaxBaseController;

header("Access-Control-Allow-Origin:*");

class AjaxBallotController extends AjaxBaseController {
    /**
     * get-valid-ballot
     * 获取当前进行中的活动信息
     * @return number
     */
    public function actionGetValidBallot() {
        // 获取当前有效的活动
        $res = Yii::$app->api->get('ballot/get-ballot-list', [
            'current_time'  => time(),
            'status'        => 1,
            'size'          => 1
        ]);
        if($res['code'] != 200) {
            $this->export('fail', '目前没有进行中的活动');
        }
        $ballot = $res['data']['list'][0];
        // 获取本活动的信息及关联的主播信息
        $res = Yii::$app->api->get('ballot/get-ballot-detail', [
            'ballot_id' => $ballot['ballot_id']
        ]);
        if($res['code'] != 200) {
            $this->export('fail', $res['message']);
        }
        if(empty($res['data']['anchorList'])) {
            $this->export('fail', '本活动尚未关联主播');
        }
        // 整理参加活动的主播数据，使数据更易读
        $anchors = [];
        foreach($res['data']['anchorList'] as $item) {
            $item['Information']['votes'] = $item['votes'];
            $anchors[] = $item['Information'];
        }
        // 按照票数多少进行排序
        usort($anchors, function($a, $b) {
            if($a['votes'] == $b['votes']) return 0;
            return $a['votes'] > $b['votes'] ? 1 : -1;
        });
        $this->export('success', '投票活动数据获取成功', [
            'ballot' => $ballot,
            'anchors' => $anchors
        ]);
    }
    /**
     * ballot-info
     * 获取指定活动的基本信息
     * @param number $ballot_id     活动ID
     */
    public function actionBallotInfo() {
        $rule = [
            'ballot_id' => ['type'=>'int', 'required'=>true]
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());
        // 获取活动基本信息
        $res = Yii::$app->api->get('ballot/info', $args);
        if($res['code'] != 200) {
            $this->export('fail', $res['message']);
        }
        $this->export('success', $res['message'], $res['data']);
    }
    /**
     * anchor-in-ballot
     * 获取活动中主播信息
     * @param number $ballot_id     活动ID
     * @param number $anchor_id     主播ID
     */
    public function actionAnchorInBallot() {
        $rule = [
            'ballot_id' => ['type' => 'int', 'required' => TRUE],
            'anchor_id' => ['type' => 'int', 'required' => TRUE]
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());
        $res = Yii::$app->api->get('ballot/anchor-in-ballot', $args);
        if($res['code'] == 200) {
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }
    /**
     * ballot-prize
     * 获取活动奖项设置
     */
    public function actionBallotPrize() {
        $rule = [
            'ballot_id' => ['type'=>'int', 'required'=>true]
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());
        // 获取活动奖项设置
        $res = Yii::$app->api->get('ballot-prize/search', $args);
        if($res['code'] != 200 || empty($res['data'])) {
            $this->export('fail', $res['message']);
        }
        $this->export('success', $res['message'], $res['data']);
    }
}