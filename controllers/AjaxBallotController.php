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
            'size'          => 1
        ]);
        if($res['code'] != 200) {
            $this->export('fail', '目前没有进行中的活动');
        }
        $ballot = $res['data']['list'][0];
        $ballot['votes'] += $ballot['votes_amend'];
        $ballot['begin_timestamp'] = $ballot['begin_time'];
        $ballot['end_timestamp'] = $ballot['end_time'];
        $ballot['begin_time'] = date('m月d日',$ballot['begin_time']);
        $ballot['end_time'] = date('m月d日',$ballot['end_time']);
        unset($ballot['votes_amend']);
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
            $item['Information']['votes'] = $item['votes'] + $item['votes_amend'];
            $anchors[] = $item['Information'];
        }
        usort($anchors, function($a, $b) {
            if($a['votes'] == $b['votes']) return 0;
            return $a['votes'] < $b['votes'] ? 1 : -1;
        });
        foreach ($anchors as $key => $value){
            $anchors[$key]['ranking'] = $key+1;
        }
        // 按照票数多少进行排序
        usort($anchors, function($a, $b) {
            if($a['news_time'] == $b['news_time']) return 0;
            return $a['news_time'] < $b['news_time'] ? 1 : -1;
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
            'anchor_id' => ['type' => 'int', 'required' => TRUE],
            'openid' => ['type' => 'string', 'required' => false],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());
        $res = Yii::$app->api->get('ballot/anchor-in-ballot', $args);
        if($res['code'] == 200) {
            $res['data']['ShareTitle'] = "萌主派对第一季，闪亮主播风云榜";
            $res['data']['ShareDescripion'] = "快来帮#".$res['data']['name']."#投票吧，赢取最新美图手机！";
            $res['data']['ShareImg'] = $res['data']['thumb'];
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
        $args = $this->getRequestData($rule, Yii::$app->request->get());
        $ballotResult = Yii::$app->api->get('ballot/get-ballot-detail', $args);
        if($ballotResult['code'] != 200 || empty($ballotResult['data'])) {
            $this->export('fail', $ballotResult['message']);
        }
        if(isset($ballotResult['data']['anchorList'])){
            unset($ballotResult['data']['anchorList']);
        }
        $ballot = $ballotResult['data'];
        $ballot['begin_timestamp'] = $ballot['begin_time'];
        $ballot['end_timestamp'] = $ballot['end_time'];
        $ballot['begin_time'] = date('m月d日',$ballot['begin_time']);
        $ballot['end_time'] = date('m月d日',$ballot['end_time']);
        // 获取活动奖项设置
        $res = Yii::$app->api->get('ballot-prize/search', $args);
        if($res['code'] != 200 || empty($res['data'])) {
            $this->export('fail', $res['message']);
        }
        $parizeList = $res['data'];
        $ballot['parizeList'] = $parizeList;

        $this->export('success', $res['message'], $ballot);
    }
    /**
     * ballot-add-votes
     * 投票
     */
    public function actionBallotAddVotes() {
        $rule = [
            'ballot_id' => ['type' => 'int', 'required' => TRUE],//活动ID
            'anchor_id' => ['type' => 'int', 'required' => TRUE],//主播ID
            'fans_id' => ['type' => 'int', 'required' => TRUE],//粉丝ID
            'votes' => ['type' => 'int', 'required' => FALSE],//投票票数
            'is_canvass' => ['type' => 'int', 'required' => TRUE],//是否被拉票
            'canvass_id' => ['type' => 'int', 'required' => FALSE],//拉票ID
            'amount' => ['type' => 'int', 'required' => FALSE],//拉票金额
            'url' => ['type' => 'string', 'required' => TRUE],//拉票分享地址
            'status' => ['type' => 'int', 'required' => TRUE],//状态，1 有效，2 待支付，3 无效
            'active_time' => ['type' => 'int', 'required' => FALSE],//拉票生效时间
            'end_time' => ['type' => 'int', 'required' => TRUE],//拉票结束时间
            'new_fans' => ['type' => 'int', 'required' => FALSE,'default' => 2],//是否是新粉丝
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());
        // 获取活动奖项设置
        $res = Yii::$app->api->get('ballot/add-votes', $args);
        if($res['code'] != 200 || empty($res['data'])) {
            $this->export('fail', $res['message']);
        }
        $this->export('success', $res['message'], $res['data']);
    }
    /**
     * get-red-packet
     * 领取红包
     */
    public function actionGetRedPacket() {
        $rule = [
            'ballot_id' => ['type' => 'int', 'required' => TRUE],//活动ID
            'anchor_id' => ['type' => 'int', 'required' => TRUE],//主播ID
            'fans_id' => ['type' => 'int', 'required' => TRUE],//粉丝ID
            'canvass_id' => ['type' => 'string', 'required' => TRUE],//拉票ID
            'new_fans' => ['type' => 'int', 'required' => FALSE,'default'=>2],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());
        // 获取活动奖项设置
        $res = Yii::$app->api->get('ballot/get-red-packet', $args);
        if($res['code'] != 200 || empty($res['data'])) {
            $this->export('fail', $res['message']);
        }
        $this->export('success', $res['message'], $res['data']);
    }
    /**
     * check-red-packet
     * 查看红包
     */
    public function actionCheckRedPacket() {
        $rule = [
            'canvass_id' => ['type' => 'string', 'required' => TRUE],//拉票ID
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());
        // 获取活动奖项设置
        $res = Yii::$app->api->get('ballot/check-red-packet', $args);
        if($res['code'] != 200 || empty($res['data'])) {
            $this->export('fail', $res['message']);
        }
        if (isset($res['data']['ballot'])){
            $res['data']['ballot']['begin_time'] = date("m月d日",$res['data']['ballot']['begin_time']);
            $res['data']['ballot']['end_time'] = date("m月d日",$res['data']['ballot']['end_time']);
        }
        if (isset($res['data']['redPacket'])){
            $res['data']['redPacket']['create_time'] = date("m月d日",$res['data']['redPacket']['create_time']);
            $res['data']['redPacket']['end_time'] = date("m月d日",$res['data']['redPacket']['end_time']);
        }
        $this->export('success', $res['message'], $res['data']);
    }
}
