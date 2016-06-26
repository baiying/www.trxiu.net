<?php
namespace app\controllers;
/**
 * 投票活动异步请求控制器
 */
use Yii;
use app\controllers\AjaxBaseController;

header("Access-Control-Allow-Origin:*");

class AjaxNewsController extends AjaxBaseController {
    /**
     * get-anchor-news
     * 获取主播动态列表（并返回前三条评论）
     * @return number
     */
    public function actionGetAnchorNews() {
        $rule = [
            'anchor_id' => ['type'=>'int', 'required'=>true],
            'page' => ['type'=>'int', 'required'=>false ,'default'=>1],
            'size' => ['type'=>'int', 'required'=>false,'default'=>5]
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());
        // 获取活动基本信息
        // 获取当前有效的活动
        $res = Yii::$app->api->get('news/get-anchor-news', [
            'anchor_id'  => $args['anchor_id'],
            'page'        => $args['page'],
            'size'          => $args['size']
        ]);
        if($res['code'] == 200) {
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }
    /**
     * get-news-comment-list
     * 获取动态评论列表
     * @return number
     */
    public function actionGetNewsCommentList() {
        $rule = [
            'news_id' => ['type'=>'int', 'required'=>true],
            'page' => ['type'=>'int', 'required'=>false ,'default'=>1],
            'size' => ['type'=>'int', 'required'=>false,'default'=>20]
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());
        // 获取活动基本信息
        // 获取当前有效的活动
        $res = Yii::$app->api->get('news/get-news-comment-list', [
            'news_id'  => $args['news_id'],
            'page'        => $args['page'],
            'size'          => $args['size']
        ]);
        if($res['code'] == 200) {
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }
    /**
     * get-comment
     * 获取评论详细信息
     * @return number
     */
    public function actionGetComment() {
        $rule = [
            'comment_id' => ['type'=>'int', 'required'=>true],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());
        // 获取活动基本信息
        // 获取当前有效的活动
        $res = Yii::$app->api->get('news/get-comment', [
            'comment_id'  => $args['comment_id'],
        ]);
        if($res['code'] == 200) {
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }
    /**
     * add-anchor-news
     * 主播发布动态
     * @return number
     */
    public function actionAddAnchorNews() {
        $rule = [
            'anchor_id' => ['type' => 'int', 'required' => TRUE],
            'content' => ['type' => 'string', 'required' => TRUE],
            'images' => ['type' => 'string', 'required' => FALSE],
            'status' => ['type' => 'int', 'required' => FALSE, 'default' => 1],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());
        // 获取活动基本信息
        // 获取当前有效的活动
        $res = Yii::$app->api->post('news/add-anchor-news', $args);
        if($res['code'] == 200) {
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }
    /**
     * news-comment
     * 评论主播动态
     * @return number
     */
    public function actionNewsComment() {
        $rule = [
            'news_id' => ['type' => 'int', 'required' => TRUE],
            'fans_id' => ['type' => 'int', 'required' => TRUE],
            'content' => ['type' => 'string', 'required' => TRUE],
            'parent_comment_id' => ['type' => 'int', 'required' => FALSE],
            'status' => ['type' => 'int', 'required' => FALSE, 'default' => 1],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());
        // 获取活动基本信息
        // 获取当前有效的活动
        $res = Yii::$app->api->post('news/news-comment', $args);
        if($res['code'] == 200) {
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }
    /**
     * del-news
     * 删除主播动态
     * @return number
     */
    public function actionDelNews() {
        $rule = [
            'news_id' => ['type' => 'int', 'required' => TRUE],
            'anchor_id' => ['type' => 'int', 'required' => TRUE],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());
        $res = Yii::$app->api->post('news/del-news', $args);
        if($res['code'] == 200) {
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }
    /**
     * del-news-comment
     * 删除评论
     * @return number
     */
    public function actionDelNewsComment() {
        $rule = [
            'comment_id' => ['type' => 'int', 'required' => TRUE],
            'fans_id' => ['type' => 'int', 'required' => TRUE],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());
        $res = Yii::$app->api->post('news/del-news-comment', $args);
        if($res['code'] == 200) {
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }

}
