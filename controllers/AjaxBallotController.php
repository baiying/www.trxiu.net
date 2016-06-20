<?php
namespace app\controllers;
/**
 * 投票活动异步请求控制器
 */
use Yii;
use app\controllers\AjaxBaseController;

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
}