<?php 
  // 测试公用配置项
  class configs
  {
    // 是否测试环境
    static $istest = true;

    // 微信配置
    static $wechat = array(
      'token' => 'ice',
      'appid' => 'wxea3db525582377d1',
      'appsecret' => '042eac868be10c5c38fe591cac802465'
    );

    // 数据库配置
    static $dblink = array(
      "DB_HOST" => "localhost",
      "DB_BASE" => "com_yyg",
      "DB_USER" => "root",
      "DB_PWD"  => "123456",
      "DB_PORT" => "3306"
    );
  }
?>