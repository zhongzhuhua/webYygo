<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/ActionCommon.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/bll/order/OrderBLL.php';

  // 分页查询订单列表
  $result = null;

  try {
    $time = $_GET['time'];
    $index = $_GET['index'];
    $size = $_GET['size'];
    $sort = $_GET['sortType'];

    $bll = new OrderBLL();
    $result = $bll->pageForList($time, $sort, $index, $size);
  } catch (Exception $e) {

  }

  echo gm::getJson($result);
?>