<?php
namespace app\controllers;
/**
 * 系统设置异步请求控制器
 */
use Yii;
use app\controllers\AjaxBaseController;

header("Access-Control-Allow-Origin:*");

class AjaxSystemController extends AjaxBaseController {
    /**
     * setting
     * 获取系统设置参数
     */
    public function actionSetting() {
        $setting = [];
        $res = Yii::$app->api->get('setting/setting');
        if($res['code'] == 200) {
            $setting = $res['data'];
            if(!empty($setting)) {
                $this->export('success', '获取系统设置成功', $setting);
            } else {
                $this->export('fail', '系统尚未进行设置');
            }
        } else {
            $this->export('fail', $res['message']);
        }
        
    }
}