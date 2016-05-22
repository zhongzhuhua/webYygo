define(function(require, exports, module) {
  var gm = require('global').login();
  var ice = gm.ice;


  // 支付
  var $btnSubmit = ice.query('#btnSubmit');

  // 支付接口模版
  var jsapi = null;

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

  // 加载订单信息
  function initOrder() {
    gm.session.set('pay', '1');
    var $prodFees = ice.query('#prodFees');
    var fees = ice.parseInt(gm.session.get('payFees'));
    var jsapi = gm.session.get('payJsapi');
    var orderno = gm.session.get('payOrder');
    var porder = ice.request('orderno');

    // 判断订单信息
    if(porder != null && orderno != null && porder == orderno && jsapi != null && jsapi != '') {
      $prodFees.innerHTML = fees;
      jsapi = ice.parseJson(decodeURIComponent(ice.request('jsapi')));
    } else {
      gm.go();
    }
  };

  // 初始化
  (function() {

    // 3分钟后订单失效
    setTimeout(function() {
      gm.clearOrder();
      gm.alert('<div style="padding: 1em;">该订单已经过期</div>', function() {
        gm.go('/html/order/car.html');
      });
    }, 1000 * 60 * 3);
  

    // 初始化订单
    initOrder();

    // 绑定支付
    bindSubmit();

    // 绑定滑动事件
    gm.bindScroll(null, null);

  })();
});
