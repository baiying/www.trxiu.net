<?php
/**
 * 控制器基础类
 */
namespace app\controllers;

use Yii;
use yii\web\Controller;
use yii\helpers\Json;

class BaseController extends Controller {
    // 设置布局文件
	public $layout = "main";
	// 关闭Post安全验证
	public $enableCsrfValidation = false;
	// 页面中引用的JS文件
	public $js = [];
	// 页面中引用的CSS文件
	public $css = [];
	// 需要执行的JS对象
	public $jsObject = [];
	// 控制器中的错误信息
	public $errors = [];
    // 运行环境
    public $env = '';
	
	public function init() {
	    // 根据应用名称判断当前是生产环境还是测试环境
	    if(strpos(Yii::$app->name, "TEST") > 0) {
	        $this->env = 'test';
	    } else {
	        $this->env = 'product';
	    }
	    /*
	    if(Yii::$app->user->isGuest) {
	        $login = $this->buildUrl('account/login', 'index');
	        header('location:'.$login);
	        exit;
	    }
	    */
    }
	/**
     * 获取请求参数
     * @param  array  $rule 参数白名单
     * @param  array  $data 传递的参数数组
     * @return array  
     */
    public function getRequestData($rule = [], $data = []) {
        $result = array();
        foreach($rule as $key=>$value) {
            if(!isset($data[$key]) && isset($value['required']) && $value['required'] == TRUE) {
                $this->renderJson(ApiCode::ERROR_API_DENY, 'Lost parameter: '.$key);
            }
            switch($value['type']) {
                case 'int':
                    if(!isset($data[$key])) {
                        if(isset($value['default'])) {
                            $result[$key] = intval($value['default']);
                        }
                    } else {
                        $result[$key] = intval($data[$key]);
                    }
                    break;
                case 'float':
                    if(!isset($data[$key])) {
                        if(isset($value['default'])) {
                            $result[$key] = floatval($value['default']);
                        } 
                    } else {
                        $result[$key] = floatval($data[$key]);
                    }
                    break;
                case 'string':
                    if(!isset($data[$key])) {
                        if(isset($value['default'])) {
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
	public function buildUrl($controller, $action = "index", $args = [], $debug = FALSE) {
	    $model = $debug ? "/debug/" : "/";
	    $url = $model . $controller . "/" . $action . "/";
	    if(!empty($args)) {
	        $spl = "?";
	        foreach($args as $key=>$val) {
	            $url .= $spl . $key . "=" . $val;
	            $spl = "&";
	        }
	    }
	    return $url;
	}
}













