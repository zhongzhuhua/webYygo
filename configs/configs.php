<?php 
  // 生产线公用配置项
  class configs
  {
    // 是否测试环境
    static $istest = false;
    
    // 微信配置
    static $wechat = array(
      'token' => 'ice',
      'appid' => 'wxea3db525582377d1',
      'appsecret' => '042eac868be10c5c38fe591cac802465'
    );

    // 数据库配置
    static $dblink = array(
      "DB_HOST" => "my2886337.xincache1.cn",
      "DB_BASE" => "my2886337",
      "DB_USER" => "my2886337",
      "DB_PWD"  => "suxueduwang",
      "DB_PORT" => "3306"
    );
  }
?>