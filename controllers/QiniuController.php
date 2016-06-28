<?php
namespace app\controllers;

use Yii;
use yii\web\Controller;

header("Access-Control-Allow-Origin:*");
class QiniuController extends Controller {
    
    public function actionIndex() {
        return $this->render('index');
    }
    
    public function actionAjax() {
        if(!Yii::$app->request->get('act')) {
            $json = ['status'=>'fail', 'message'=>'缺少act参数'];
            exit(Json::encode($json));
        }
        $act = Yii::$app->request->get('act');
        switch($act) {
            // 请求上传token
            case 'token':
                $res = Yii::$app->api->get('qiniu/get-token');
                exit(json_encode(['uptoken'=>$res['data']]));
                break;
        }
        
        
    }
}