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
            foreach( $res['data']['list'] as $listKey => $listValue){
                $res['data']['list'][$listKey]['create_time'] = $this->time_tran($res['data']['list'][$listKey]['create_time']);
                if($listValue['comment_total']!=0){
                    foreach ($res['data']['list'][$listKey]['comment'] as $commentKey => $commentValue){
                        $res['data']['list'][$listKey]['comment'][$commentKey]['fans_name'] = $res['data']['list'][$listKey]['comment'][$commentKey]['fans']['wx_name'];
                        if(isset($res['data']['list'][$listKey]['comment'][$commentKey]['parent_comment_fans'])){
                            $res['data']['list'][$listKey]['comment'][$commentKey]['parent_fans_name'] = $res['data']['list'][$listKey]['comment'][$commentKey]['parent_comment_fans']['wx_name'];
                        }
                    }
                }
            }
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
            'size' => ['type'=>'int', 'required'=>false,'default'=>99]
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->get());
        // 获取活动基本信息
        // 获取当前有效的活动
        $res = Yii::$app->api->get('news/get-news-and-comment-list', [
            'news_id'  => $args['news_id'],
            'page'        => $args['page'],
            'size'          => $args['size']
        ]);
        if($res['code'] == 200) {
            foreach( $res['data']['commentList'] as $listKey => $listValue){
                if($res['data']['commentTotal']!=0){
                        $res['data']['commentList'][$listKey]['fans_name'] = $res['data']['commentList'][$listKey]['fans']['wx_name'];
                        if(isset($res['data']['commentList'][$listKey]['parent_comment_fans'])){
                            $res['data']['commentList'][$listKey]['parent_fans_name'] = $res['data']['commentList'][$listKey]['parent_comment_fans']['wx_name'];
                        }
                }
            }
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
            'openid' => ['type' => 'string', 'required' => TRUE],
            'content' => ['type' => 'string', 'required' => TRUE],
            'images' => ['type' => 'string', 'required' => FALSE],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());

        //获取用户信息，提取主播ID
        $openid = $args['openid'];
        $code = Yii::$app->api->get('fans/get-fans-info-by-openid',['openid'=>$openid]);
        if($code['code'] != 200) {
            $this->export('fail', $code['message']);
        }
        $fans = $code['data'];
        if(!isset($fans['anchor'])){
            $this->export('fail', '您还不是主播，不能发布动态');
        }
        $news['content'] = $args['content'];
        isset($args['images']) && $news['images'] = $args['images'];
        $news['anchor_id'] = $fans['anchor']['anchor_id'];

        $res = Yii::$app->api->post('news/add-anchor-news', $news);
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
            'openid' => ['type' => 'string', 'required' => TRUE],
            'content' => ['type' => 'string', 'required' => TRUE],
            'parent_comment_id' => ['type' => 'int', 'required' => FALSE],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());


        //获取用户信息，提取粉丝ID
        $openid = $args['openid'];
        $code = Yii::$app->api->get('fans/get-fans-info-by-openid',['openid'=>$openid]);
        if($code['code'] != 200) {
            $this->export('fail', $code['message']);
        }
        $comment['fans_id'] = $code['data']['fans_id'];
        $comment['news_id'] = $args['news_id'];
        $comment['content'] = $args['content'];
        isset($args['parent_comment_id']) && $comment['parent_comment_id'] = $args['parent_comment_id'];

        $res = Yii::$app->api->post('news/news-comment', $comment);
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
            'openid' => ['type' => 'string', 'required' => TRUE],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());

        //获取用户信息，提取主播ID
        $openid = $args['openid'];
        $code = Yii::$app->api->get('fans/get-fans-info-by-openid',['openid'=>$openid]);
        if($code['code'] != 200) {
            $this->export('fail', $code['message']);
        }
        $fans = $code['data'];
        if(!isset($fans['anchor'])){
            $this->export('fail', '您还不是主播，不能发布动态');
        }
        $news['news_id'] = $args['news_id'];
        $news['anchor_id'] = $fans['anchor']['anchor_id'];

        $res = Yii::$app->api->post('news/del-news', $news);
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
            'openid' => ['type' => 'string', 'required' => TRUE],
        ];
        $args = $this->getRequestData($rule, Yii::$app->request->post());

        //获取用户信息，提取粉丝ID
        $openid = $args['openid'];
        $code = Yii::$app->api->get('fans/get-fans-info-by-openid',['openid'=>$openid]);
        if($code['code'] != 200) {
            $this->export('fail', $code['message']);
        }
        $comment['fans_id'] = $code['data']['fans_id'];
        $comment['comment_id'] = $args['comment_id'];

        $res = Yii::$app->api->post('news/del-news-comment', $comment);
        if($res['code'] == 200) {
            $this->export('success', $res['message'], $res['data']);
        } else {
            $this->export('fail', $res['message']);
        }
    }

}
