<?php
/**
 * 控制器基础类
 */
namespace app\controllers;

use Yii;
use yii\web\Controller;
use yii\helpers\Json;

header("Access-Control-Allow-Origin:*");

class AjaxBaseController extends Controller
{
    // 关闭Post安全验证
    public $enableCsrfValidation = false;
    // 控制器中的错误信息
    public $errors = [];
    // 运行环境
    public $env = '';

    public function init()
    {
        /*
        if(!Yii::$app->request->isAjax) {
            exit(Json::encode(['status'=>'fail', 'message'=>'请使用ajax方式调用接口', 'data'=>[]]));
        }
        */
    }

    /**
     * 获取请求参数
     * @param  array $rule 参数白名单
     * @param  array $data 传递的参数数组
     * @return array
     */
    public function getRequestData($rule = [], $data = [])
    {
        $result = array();
        foreach ($rule as $key => $value) {
            if (!isset($data[$key]) && isset($value['required']) && $value['required'] == TRUE) {
                exit(Json::encode(['status' => 'fail', 'message' => 'Lost parameter: ' . $key, 'data' => []]));
            }
            switch ($value['type']) {
                case 'int':
                    if (!isset($data[$key])) {
                        if (isset($value['default'])) {
                            $result[$key] = intval($value['default']);
                        }
                    } else {
                        $result[$key] = intval($data[$key]);
                    }
                    break;
                case 'float':
                    if (!isset($data[$key])) {
                        if (isset($value['default'])) {
                            $result[$key] = floatval($value['default']);
                        }
                    } else {
                        $result[$key] = floatval($data[$key]);
                    }
                    break;
                case 'string':
                    if (!isset($data[$key])) {
                        if (isset($value['default'])) {
                            $result[$key] = $value['default'];
                        }
                    } else {
                        $result[$key] = htmlspecialchars(addslashes(strip_tags(trim($data[$key]))));
                    }
                    break;
            }
        }
        return $result;
    }

    /**
     * 生成URL
     * @param string $controller
     * @param string $action
     * @param array $args
     * @param bool $debug
     * @return string
     */
    public function buildUrl($controller, $action = "index", $args = [], $debug = FALSE)
    {
        $model = $debug ? "/debug/" : "/";
        $url = $model . $controller . "/" . $action . "/";
        if (!empty($args)) {
            $spl = "?";
            foreach ($args as $key => $val) {
                $url .= $spl . $key . "=" . $val;
                $spl = "&";
            }
        }
        return $url;
    }

    /**
     * 规范输出ajax调用结果
     * @param string $status 执行结果，success 表示执行成功，fail 表示执行失败
     * @param string $message 描述信息，用于描述成功提示信息或错误原因
     * @param unknown $data 数据结果
     */
    public function export($status = 'fail', $message = "", $data = [])
    {
        exit(Json::encode(['status' => $status, 'message' => $message, 'data' => $data]));
    }


    /**
     * 通用格式化事件
     * @param int $the_time 时间戳
     * @return bool|string $the_time 格式化后格式
     */
    function time_tran($the_time)
    {
//        $now_time = date("Y-m-d H:i:s", time() + 8 * 60 * 60);
        $now_time = time();
        $show_time = $the_time;
        $dur = $now_time - $show_time;
        if ($dur < 0) {
            return date("m月d日",$the_time);
        } else
        {
            if ($dur < 60)
            {
                return $dur . '秒前';
            } else {
                if ($dur < 3600)
                {
                    return floor($dur / 60) . '分钟前';
                } else {
                    if ($dur < 86400)
                    {
                        return floor($dur / 3600) . '小时前';
                    } else {
//                        if ($dur < 259200) {//3天内
//                            return floor($dur / 86400) . '天前';
//                        } else {
                            return date("m月d日",$the_time);
//                        }
                    }
                }
            }
        }
    }

}













