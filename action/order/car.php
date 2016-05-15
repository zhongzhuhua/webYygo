<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/ActionCommon.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/bll/prod/ProdsBLL.php';

  // 分页查询订单列表
  $result = null;

  try {
    $ids = $_GET['ids'];

    $bll = new ProdsBLL();
    $result = $bll->findByIdList($ids);
  } catch (Exception $e) {

  }

  echo gm::getJson($result);
?>