<?php
namespace app\controllers;
/**
 * 在线支付异步请求控制器
 */
use Yii;
use app\controllers\AjaxBaseController;

header("Access-Control-Allow-Origin:*");

class AjaxPayController extends AjaxBaseController {
    /**
     * wx-prepay
     * 微信统一下单接口，生成系统充值流水及微信预付订单
     * 流水单生成后需要在指定时间段内支付成功，否则将会取消
     * @param int $data['fans_id']      流水单所属用户ID
     * @param int $data['ballot_id']    流水单关联活动ID
     * @param int $data['anchor_id']    流水单关联主播ID
     * @param int $data['openid']       充值微信账号的openid
     * @param int $data['total']        充值金额，“分”为单位
     */
    public function actionWxPrepay() {
        $rule = [
            'fans_id'   => ['type'=>'int', 'required'=>true],
            'ballot_id' => ['type'=>'int', 'required'=>true],
            'anchor_id' => ['type'=>'int', 'required'=>true],
            'openid'    => ['type'=>'string', 'required'=>true],
            'total'     => ['type'=>'int', 'required'=>true],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());
        $res = Yii::$app->api->post('weixin/unified-order', $args);
        if($res['code'] == 200) {
            $this->export('success', '支付参数获取成功', $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }
    /**
     * wx-pay-result
     * 查询微信支付是否成功
     * 以下两个查询参数提供任一即可
     * @param string $args['transaction_id']        微信订单号
     * @param string $args['out_trade_no']          商户订单号
     */
    public function actionWxPayResult() {
        $rule = [
            'transaction_id' => ['type'=>'string', 'required'=>FALSE],
            'out_trade_no'   => ['type'=>'string', 'required'=>FALSE],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());
        if(!isset($args['transaction_id']) && !isset($args['out_trade_no'])) {
            $this->export('fail', '微信订单号和商户订单号至少要提供其一');
        }
        $res = Yii::$app->api->get('weixin/query-pay-result', $args);
        if($res['code'] == 200) {
            $this->export('success', $res['message']);
        } else {
            $this->export('fail', $res['message']);
        }
    }
}