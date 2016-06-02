<?php  
	require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/ActionCommon.php';

  // 微信订单
  require_once $_SERVER['DOCUMENT_ROOT'].'/libapp/wechat/lib/WxPay.Api.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/libapp/wechat/lib/WxPay.Data.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/libapp/wechat/lib/WxPay.JsApiPay.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/bll/order/OrderUserBLL.php';

  $result = new JsonResult();
  $msg = '';
  $fees = 0;

  // try {
  // 	$orderno = $_POST['orderno'];

  // 	if(gm::isNull($orderno)) {
  // 		$result->error('该订单不存在');
  // 	} else {
		// 	// 查询微信订单是否支付成功
		// 	$input = new WxPayOrderQuery();
  //     $input->SetOut_trade_no($orderno);
  //     $result = WxPayApi::orderQuery($input);

  //     // 微信订单是否存在返回码 'SUCCESS' 是成功
  //     $return_code = $result['return_code'];
  //     $return_msg = $result['return_msg'];

  //     if(!is_null($return_code) && $return_code == 'SUCCESS') {

  //     	// 已经存在的订单状态返回码 'SUCCESS' 是成功
  //       $result_code = $result['result_code'];

  //       if(!is_null($result_code) && $result_code == 'SUCCESS') {

  //       	// 订单支付状态 'SUCCESS' 是成功
  //         $state = $result['trade_state'];
  //         if(is_null($state)) {
  //           $msg = '微信支付系统异常';
  //         } else if ($state == 'SUCCESS') {
  //         	// 订单支付的金额
  //           $fee = $result['total_fee'];
  //         } else if ($state == 'REFUND') {
  //           $msg = '转入退款';
  //         } else if ($state == 'NOTPAY') {
  //           $msg = '订单未支付';
  //         } else if ($state == 'CLOSED') {
  //           $msg = '订单已经关闭';
  //         } else if ($state == 'REVOKED') {
  //           $msg = '订单支付已撤销';
  //         } else if ($state == 'USERPAYING') {
  //           $msg = '等待支付中...';
  //         } else if ($state == 'PAYERROR') {
  //           $msg = '支付失败，第三方系统[如银行等]繁忙';
  //         } else {
  //           $msg = '微信支付系统异常';
  //         }

  //       } else {
  //         $msg = is_null($result['err_code']) || $result['err_code'] == 'SYSTEMERROR' ? '微信支付系统异常' : '不存在此交易订单号';
  //       }
  //     } else {
  //       $msg = $result['return_msg'];
  //     }
  // 	}
  // } catch(Exception $e) {
  // 	$msg = '支付后台异常';
  // }

  $orderno = $_POST['orderno'];
  $fees = 1;

  try {
  	if(gm::isNull($msg)) {
  		if($fees > 0) {
  			$bll = new OrderUserBLL();
  			$msg = '';
  			$result = $bll->paySuccess($orderno, $fees / 100);
  		} else {
  			$msg = '支付订单金额异常';
  		}
  	}
  } catch(Exception $e) {
  	$msg = '支付订单异常';
  }

  if($msg != '') {
  	$result->error($msg);
  }

  echo gm::getJson($result);
?>