<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/ActionCommon.php';

  // 微信订单
  require_once $_SERVER['DOCUMENT_ROOT'].'/libapp/wechat/lib/WxPay.Api.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/libapp/wechat/lib/WxPay.Data.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/libapp/wechat/lib/WxPay.JsApiPay.php';

  // 创建用户临时订单
  $result = new JsonResult();

  try {
    $wxfee = $_POST['fees'];
    $orderno = $_POST['orderno'];

    $wxfee = gm::isNull($wxfee) ? 0 : $wxfee * 100;

    if(gm::isNull($gm_user) || gm::isNull($gm_user['uid']) || gm::isNull($gm_user['openid'])) {
      $result->error('', 2);
    } else if(gm::isNull($wxfee) || gm::isNull($orderno) || !gm::regInt($wxfee)) {
      $result->error('订单信息无效，请返回重试!');
    } else {
      // 测试的话，付款1分钱
      if(configs::$wxtest) {
        $wxfee = 1;
      }

      // 初始化支付
      $tools = new JsApiPay();

      // 统一订单接口
      $input = new WxPayUnifiedOrder();
      $input->SetBody("幕拍商品");
      $input->SetGoods_tag("幕拍商品");
      $input->SetOut_trade_no($orderno);
      $input->SetTotal_fee($wxfee);
      $input->SetTime_start(date("YmdHis"));
      $input->SetTime_expire(date("YmdHis", time() + 600));
      $input->SetNotify_url("http://paysdk.weixin.qq.com/example/notify.php");
      $input->SetTrade_type("JSAPI");
      $input->SetOpenid($openid);
      $order = WxPayApi::unifiedOrder($input);
      $jsApiParameters = $tools->GetJsApiParameters($order);

      $result->data = $jsApiParameters;
      $result->success('');
    }

  } catch(Exception $e) {
    $result->error($e->getMessage());
  }

  echo gm::getJson($result);
?>