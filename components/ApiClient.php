<?php
namespace app\components;

use Yii;
use yii\base\Component;
/**
 * API访问类
 * @property bool       $debug
 * @property string     $url
 * @property string     $format 输出格式，支持：json/text/log，text 将直接输出api的返回内容，log 将api返回内容保存到apilog.log文件中
 * @author bai
 */
class ApiClient extends Component {
    
    public $appId;
    public $apiSecretKey;
    private $postdata;
    /**
     * 最近一次访问返回的头信息
     */
    public $http_info;
    public $url;
    public $http_code;
    /**
     * 设置useragent.
     */
    public $useragent = '';
    /**
     * 连接超时时间
     */
    public $connecttimeout = 30;
    /**
     * 运行超时时间
     */
    public $timeout = 30;
    /**
     * API HOST
     */
    public $host;
    /**
     * 返回结果格式
     */
    public $format = 'json';
    /**
     * 是否开启调试模式
     */
    public $debug = FALSE;
    /**
     * boundary of multipart
     * @ignore
     */
    public static $boundary = '';

    public $logFile = "";
    
    public function __construct($config = []) {
        $this->appId = $config['appId'];
        $this->apiSecretKey = $config['apiSecretKey'];
        $this->host = $config['host'];
        $this->logFile = "api_access_".date("Ymd") . ".log";
        parent::__construct($config);
    }
    /**
     * 发送GET请求
     *
     * @return mixed
     */
    public function get($url, $parameters = []) {
        // 生成API访问签名字符串
        $parameters['_hmac'] = $this->getHmac($parameters);
        $parameters['_appid'] = $this->appId;
        
        $response = $this->oAuthRequest($url, 'GET', $parameters);
        switch($this->format) {
            case 'json':
                if(is_null(json_decode($response, true))) {
                    return ['code' => 500, 'message' => '接口访问错误', 'data' => $response];
                } else {
                    return json_decode($response, true);
                }
                break;
            case 'text':
                return $response;
                break;
            case 'log':
                $log = "========== " . date("Y-m-d H:i:s") . " ==========\n";
                $log .= $response . "\n";
                $log .= "================================================\n";
                error_log($log, 3, $this->logFile);
                return $response;
                break;
            default:
                return $response;
                break;
        }
    }
    
    /**
     * 发送POST请求
     *
     * @return mixed
     */
    public function post($url, $parameters = array(), $multi = false) {
        // 生成API访问签名字符串
        $parameters['_hmac'] = $this->getHmac($parameters);
        $parameters['_appid'] = $this->appId;
        $response = $this->oAuthRequest($url, 'POST', $parameters, $multi );
        switch($this->format) {
            case 'json':
                if(is_null(json_decode($response, true))) {
                    return ['code' => 500, 'message' => '接口访问错误', 'data' => $response];
                } else {
                    return json_decode($response, true);
                }
                break;
            case 'text':
                return $response;
                break;
            case 'log':
                $log = "========== " . date("Y-m-d H:i:s") . " ==========\n";
                $log .= $response . "\n";
                $log .= "==================================\n";
                error_log($log, 3, $this->logFile);
                return $response;
                break;
            default:
                return $response;
                break;
        }
    }
    
    /**
     * 格式化并发送一次请求
     *
     * @return string
     * @ignore
     */
    private function oAuthRequest($url, $method, $parameters, $multi = false) {
    
        if (strrpos($url, 'http://') !== 0 && strrpos($url, 'https://') !== 0) {
            $url = "{$this->host}{$url}/";
        }
        
        switch ($method) {
            case 'GET':
                $url = $url . '?' . http_build_query($parameters);
                return $this->http($url, 'GET');
            default:
                $headers = array();
                if (!$multi && (is_array($parameters) || is_object($parameters)) ) {
                    $body = http_build_query($parameters);
                } else {
                    $body = self::build_http_query_multi($parameters);
                    $headers[] = "Content-Type: multipart/form-data; boundary=" . self::$boundary;
                }
                return $this->http($url, $method, $body, $headers);
        }
    }
    
    /**
     * Make an HTTP request
     *
     * @return string API results
     * @ignore
     */
    private function http($url, $method, $postfields = NULL, $headers = array()) {
    
        $this->http_info = array();
        $ci = curl_init();
        /* Curl settings */
        curl_setopt($ci, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0);
        curl_setopt($ci, CURLOPT_USERAGENT, $this->useragent);
        curl_setopt($ci, CURLOPT_CONNECTTIMEOUT, $this->connecttimeout);
        curl_setopt($ci, CURLOPT_TIMEOUT, $this->timeout);
        curl_setopt($ci, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ci, CURLOPT_ENCODING, "");
        curl_setopt($ci, CURLOPT_HEADER, FALSE);
    
        switch ($method) {
            case 'POST':
                curl_setopt($ci, CURLOPT_POST, TRUE);
                if (!empty($postfields)) {
                    curl_setopt($ci, CURLOPT_POSTFIELDS, $postfields);
                    $this->postdata = $postfields;
                }
                break;
            case 'DELETE':
                curl_setopt($ci, CURLOPT_CUSTOMREQUEST, 'DELETE');
                if (!empty($postfields)) {
                    $url = "{$url}?{$postfields}";
                }
        }
    
        curl_setopt($ci, CURLOPT_URL, $url );
        curl_setopt($ci, CURLOPT_HTTPHEADER, $headers );
        curl_setopt($ci, CURLINFO_HEADER_OUT, TRUE );
    
        $response = curl_exec($ci);
        $this->http_code = curl_getinfo($ci, CURLINFO_HTTP_CODE);
        $this->http_info = array_merge($this->http_info, curl_getinfo($ci));
        $this->url = $url;
    
        if ($this->debug) {
            echo "=====post data======\r\n";
            var_dump($postfields);
    
            echo "=====headers======\r\n";
            print_r($headers);
    
            echo '=====request info====='."\r\n";
            print_r( curl_getinfo($ci) );
    
            echo '=====response====='."\r\n";
            print_r( $response );
        }
        curl_close ($ci);
        return $response;
    }
    /**
     * 生成签名字符串
     * @return string
     */
    private function getHmac($data = [], $debug = false) {
        // 将传递参数按照参数名升序排列
        $data['_appid'] = $this->appId;
        $dataKeys = array_keys($data);
        sort($dataKeys);
        $dataStr = $spl = "";
        foreach($dataKeys as $k) {
            $dataStr .= $spl . $k . "=" . $data[$k];
            $spl = "&";
        }
        $dataStr .= $spl . "salt={$this->apiSecretKey}";
        return strtoupper(md5($dataStr));
    }
    
}