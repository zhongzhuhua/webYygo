<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/ActionCommon.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/wechat/WechatUtil.php';

  // 获取微信传过来的 code
  $code = $_POST['code'];

  // 获取用户 openid
  $openid = WechatUtil::getOpenId($code);

  // 获取用户信息
  gm::setSession('openid', $openid);

  $result = new JsonResult();
  $result->data['openid'] = $openid;
  $result->success();
  
  echo gm::getJson($result);
?>