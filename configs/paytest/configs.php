<?php 
  // 浩淇公用配置项
  class configs
  {
    // 是否测试环境
    static $istest = false;
    // 是否微信测试
    static $wxtest = true;
    
    // 微信配置
    static $wechat = array(
      'token' => 'ice',
      'appid' => 'wx5b08cfd22ea4c57e',
      'appsecret' => '7b1ac33eed0d46ddf9724c0edadbeeb3'
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