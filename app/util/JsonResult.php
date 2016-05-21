<?php
  // 公用系统返回数据 
  class JsonResult {

    // status=0 正常，-1不提示，2需要重新登录，3需要刷新，4创建微信订单失败，其他的提示
    public $status = -1;
    public $msg = '系统繁忙';
    public $data;
    public $timestamp;

    function __construct() {
      $this->data = array();
      $this->timestamp = time();
    }

    public function error($_msg, $code = 1) {
      $this->status = $code;
      $this->msg = $_msg;
    }

    public function success($_msg = '') {
      $this->status = 0;
      $this->msg = $_msg;
    }
  }
?>