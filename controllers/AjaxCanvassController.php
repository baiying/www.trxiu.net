<?php
namespace app\controllers;
/**
 * 拉票异步请求控制器
 */
use Yii;
use app\controllers\AjaxBaseController;

header("Access-Control-Allow-Origin:*");

class AjaxCanvassController extends AjaxBaseController {
    /**
     * info
     * 获取拉票基本信息
     * @param number $data['canvass_id']     拉票ID
     */
    public function actionInfo() {
        $rule = [
            'canvass_id' => ['type'=>'string', 'required'=>TRUE],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());
        $res = Yii::$app->api->get('canvass/info', $args);
        if($res['code'] == 200) {
            $res['data']['ShareTitle'] = "萌主派对第一季，闪亮主播风云榜";
            $res['data']['ShareDescripion'] = "快来为心仪的主播投票，每天红包领不停！";
            $res['data']['ShareImg'] = "http://o8syigvwe.bkt.clouddn.com/o_1amdi1me5l8c16jc18bq1d6hdrgn.png";
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }
    /**
     * receive-redpackage
     * 领取红包
     * 
     */
    public function actionReceiveRedpackage() {
        $rule = [
            'ballot_id'     => ['type'=>'int', 'required'=>true],
            'canvass_id'    => ['type'=>'string', 'required'=>true],
            'fans_id'       => ['type'=>'int', 'required'=>true],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());
        $res = Yii::$app->api->post('canvass/receive-redpackage', $args);
        if($res['code'] == 200) {
            $res['data']['ShareTitle'] = "萌主派对第一季，闪亮主播风云榜";
            $res['data']['ShareDescripion'] = "快来为心仪的主播投票，每天红包领不停！";
            $res['data']['ShareImg'] = "http://o8syigvwe.bkt.clouddn.com/o_1amdi1me5l8c16jc18bq1d6hdrgn.png";
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }
    /**
     * create
     * 发起拉票
     * @param number $data['ballot_id']     活动ID
     * @param number $data['anchor_id']     主播ID
     * @param number $data['fans_id']       粉丝ID
     * @param string $data['source_id']     来源拉票ID
     * @param number $data['charge']        充值金额
     * @param number $data['status']        拉票状态，1 有效，2 待支付，3 无效
     */
    public function actionCreate() {
        $rule = [
            'ballot_id'     => ['type'=>'int', 'required'=>true],
            'anchor_id'     => ['type'=>'int', 'required'=>true],
            'fans_id'       => ['type'=>'int', 'required'=>true],
            'source_id'     => ['type'=>'int', 'required'=>false],
            'charge'        => ['type'=>'float', 'required'=>true],
            'status'        => ['type'=>'int', 'required'=>false, 'default'=>1],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());
        $res = Yii::$app->api->post('canvass/create-canvass', $args);
        if($res['code'] == 200) {
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }
}