<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/ActionCommon.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/bll/order/OrderUserBLL.php';

  // 创建用户临时订单
  $result = null;
  $prods = $_POST['prods'];

  if(is_null($gm_user)) {
    echo gm::getJson(JsonResult::login());
  } else {
    $uid = $gm_user['uid'];
    $openid = $gm_user['openid'];

    if(gm::isNull($uid) || gm::isNull($openid)) {
      echo gm::getJson(JsonResult::login());
    } else {
      // 创建系统订单
      $bll = new OrderUserBLL();
      $result = $bll->insert($uid, $prods);

      echo gm::getJson($result);
    }
  }
?>