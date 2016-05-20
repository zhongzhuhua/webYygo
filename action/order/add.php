<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/ActionCommon.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/bll/order/OrderUserBLL.php';

  // 创建用户临时订单
  $result = null;

  if(is_null($gm_user)) {
    $result = new JsonResult();
    $result->error('', 2);
    echo gm::getJson($result);;
  } else {
    $uid = $gm_user['uid'];
    $prods = $_POST['prods'];
    $bll = new OrderUserBLL();
    $result = $bll->insert($uid, $prods);

    echo gm::getJson($result);
  }
?>