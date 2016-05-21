define(function(require, exports, module) {
  var gm = require('global').login();
  var ice = gm.ice;

  var $prodFees = ice.query('#prodFees');
  var fees = ice.request('fees');
  var orderno = ice.request('orderno');
  var jsapi = ice.parseJson(decodeURIComponent(ice.request('jsapi')));

  // 支付
  var $btnSubmit = ice.query('#btnSubmit');

  $prodFees.innerHTML = fees;

  // 微信支付回调
  function callpay() {
    if (typeof WeixinJSBridge == 'undefined') {
      if (document.addEventListener) {
        document.addEventListener('WeixinJSBridgeReady', jsApiCall, false);
      } else if (document.attachEvent) {
        document.attachEvent('WeixinJSBridgeReady', jsApiCall);
        document.attachEvent('onWeixinJSBridgeReady', jsApiCall);
      }
    } else {
      jsApiCall();
    }
  };

  //调用微信JS api 支付
  function jsApiCall() {
    if(jsapi == undefined || jsapi == '') {
      gm.mess('微信支付回调失败，请重试');
      return;
    }
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      jsapi,
      function(res) {
        res = res.err_msg;
        if(res == undefined || res == '') {
          res = '付款失败';
        } else if (res.indexOf('cancel') > -1) {
          res = '取消付款';
        } else if (res.indexOf('ok') > -1) {
          res = '恭喜您，支付成功';
        }
        gm.mess(res);
      }
    );
  };

  // 绑定支付
  function bindSubmit() {
    $btnSubmit.addEventListener(ice.tapClick, function(e) {
      callpay();
    });
  };


  // 初始化
  (function() {

    // 绑定支付
    bindSubmit();

    // 绑定滑动事件
    gm.bindScroll(gm.refresh, null);

  })();
});
