<?php
namespace app\components;

use Yii;
use yii\base\Component;

class Cookies extends Component {
    
    private $salt = "123";
    /**
     * 加密
     * @param unknown $value
     * @return string
     */
    private function encrypt($value) {  
        $key = $this->salt;
        $ivSize = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
        $iv = mcrypt_create_iv($ivSize, MCRYPT_RAND);
        $encryptText = mcrypt_encrypt(MCRYPT_RIJNDAEL_128, $key, $value, MCRYPT_MODE_CBC, $iv);
        return trim(base64_encode($iv.$encryptText));
    }
    /**
     * 解密
     * @param unknown $value
     * @return string
     */
    private function decrypt($value) {
        $key = $this->salt;
        $cryptText = base64_decode($value);
        $ivSize = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
        $iv = substr($cryptText, 0, $ivSize);
        $cryptText = substr($cryptText, $ivSize);
        $decryptText = mcrypt_decrypt(MCRYPT_RIJNDAEL_128, $key, $cryptText, MCRYPT_MODE_CBC, $iv);
        return rtrim($decryptText, "\0");
    }
    /**
     * 读取cookie数据
     * @param unknown $cookieName
     * @return boolean|string
     */
    public function getValue($cookieName) {
        if(!isset($_COOKIE[$cookieName])) return false;
        return $this->decrypt($_COOKIE[$cookieName]);
    }
    /**
     * 设置cookie
     * @param string $data['name']      cookie名称
     * @param string $data['value']     cookie值
     * @param number $data['expire']    到期时间戳，单位：秒
     * @param string $data['domain']    有效域
     * @param string $data['path']      有效目录
     * @param bool   $data['secure']    是否使用https协议访问
     * @param bool   $data['httponly']  是否仅允许http方式访问
     */
    public function setValue($data = []) {
        $config = [
            'name'      => '',
            'value'     => '',
            'expire'    => time() + 3600,
            'domain'    => null,
            'path'      => "/",
            'secure'    => null,
            'httponly'  => null
        ];
        foreach($data as $key=>$val) {
            $config[$key] = $val;
        }
        $crValue = $this->encrypt($config['value']);
        return setcookie($config['name'], $crValue, $config['expire'], $config['path'], $config['domain'], $config['secure'], $config['httponly']);
    }
    /**
     * 判断cookie是否存在
     * @param unknown $cookieName
     */
    public function has($cookieName) {
        return isset($_COOKIE[$cookieName]);
    }
    /**
     * 删除cookie
     * @param unknown $cookieName
     */
    public function remove($cookieName) {
        if(isset($_COOKIE[$cookieName])) {
            return setcookie($cookieName, '', time()-86400);
        }
    }
}