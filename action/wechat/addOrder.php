<?php  
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/util/ActionCommon.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/app/bll/order/OrderUserBLL.php';

  // 微信订单
  require_once $_SERVER['DOCUMENT_ROOT'].'/libapp/wechat/lib/WxPay.Api.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/libapp/wechat/lib/WxPay.Data.php';
  require_once $_SERVER['DOCUMENT_ROOT'].'/libapp/wechat/lib/WxPay.JsApiPay.php';

  // 创建用户临时订单
  $result = null;
  $prods = $_POST['prods'];

  if(is_null($gm_user)) {
    $result = new JsonResult();
    echo gm::getJson($result);
  } else {
    $uid = $gm_user['uid'];
    $openid = $gm_user['openid'];

    if(gm::isNull($uid) || gm::isNull($openid)) {
      $result = new JsonResult();
      echo gm::getJson($result);;
    } else {
      // 创建系统订单
      $bll = new OrderUserBLL();
      $result = $bll->insert($uid, $prods);

      // 创建微信订单 
      if(!configs::$istest) {
        $orderno = $result->data['orderno'];
        $wxfee = $result->data['fees'] * 100;

        if(configs::$wxtest) {
          $wxfee = 1;
        }

        try {
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
          $result->jsapi = $jsApiParameters;
        } catch(Exception $e) {
          $result->error('创建微信订单失败', 4);
        }
      } else {
        $result->jsapi = true;
      }

      echo gm::getJson($result);
    }
  }
?>