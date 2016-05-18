<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/ActionCommon.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/bll/prod/ProdsBLL.php';

  // 分页查询订单列表
  $result = null;

  try {
    $id = $_GET['id'];

    $bll = new ProdsBLL();
    $result = $bll->findById($id);
  } catch (Exception $e) {

  }

  echo gm::getJson($result);
?>