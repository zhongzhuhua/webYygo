<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/ActionCommon.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/bll/order/OrderUserBLL.php';

  // 订单取消
  try {
    if(!is_null($gm_user)) {
      $uid = $gm_user['uid'];  
      $bll = new OrderUserBLL();
      $bll->unfrozen($uid);
    }
  } catch(Exception $e) {

  }

  echo '';
?>