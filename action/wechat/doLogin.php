<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/ActionCommon.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/wechat/WechatUtil.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/bll/user/UserBLL.php';

  // 获取微信传过来的 code
  $code = $_POST['code'];

  // 获取用户 openid
  $openid = WechatUtil::getOpenId($code);
 
  // 登录
  $result = null;
  if(!gm::isNull($openid)) {
    $bll = new UserBLL();
    $result = $bll->loginByOpenId($openid);

    if($result !== null && $result->status === 0) {
      gm::setSession('user', $result->data);
    }
  }
  
  echo gm::getJson($result);
?>