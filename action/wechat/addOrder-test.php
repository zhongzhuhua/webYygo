<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/ActionCommon.php';

  // 微信订单
  require_once $_SERVER['DOCUMENT_ROOT'].'/libapp/wechat/lib/WxPay.Api.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/libapp/wechat/lib/WxPay.Data.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/libapp/wechat/lib/WxPay.JsApiPay.php';

  // 初始化支付
  $result = new JsonResult();
  $tools = new JsApiPay();

  // 统一订单接口
  $input = new WxPayUnifiedOrder();
  $input->SetBody("幕拍商品");
  $input->SetGoods_tag("幕拍商品");
  $input->SetOut_trade_no('zhongzhuhua');
  $input->SetTotal_fee(1);
  $input->SetTime_start(date("YmdHis"));
  $input->SetTime_expire(date("YmdHis", time() + 600));
  $input->SetNotify_url("http://paysdk.weixin.qq.com/example/notify.php");
  $input->SetTrade_type("JSAPI");
  $input->SetOpenid('oK_uExI5NXDAKcc_8E71q0KXxhms');
  $order = WxPayApi::unifiedOrder($input);
  $jsApiParameters = $tools->GetJsApiParameters($order);
  $result->data = $jsApiParameters;
  $result->success('');

  echo gm::getJson($result);
?>