define(function(require, exports, module) {
  var gm = require('global').login();
  var ice = gm.ice;


  var $prodFees = ice.query('#prodFees');
  var fees = ice.parseInt(gm.session.get('payFees'));
  var orderno = gm.session.get('payOrder');
  var porder = ice.request('orderno');

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
    ice.ajax({
      url: gm.path + '/wx/addOrder.php',
      data: {
        orderno: orderno,
        fees: fees
      },
      type: 'post',
      dataType: 'json',
      success: function(data) {
        gm.ajaxMsg(data);

        try {
          if (data.status == '0') {
            jsapi = data.data;

            if (jsapi == null || jsapi == '') {
              if (gm.istest) {
                paySuccess();
              } else {
                // 调用微信支付
                WeixinJSBridge.invoke(
                  'getBrandWCPayRequest',
                  jsapi,
                  function(res) {
                    res = res.err_msg;
                    if (res == undefined || res == '') {
                      res = '付款失败';
                    } else if (res.indexOf('cancel') > -1) {
                      res = '取消付款';
                    } else if (res.indexOf('ok') > -1) {
                      paySuccess();
                    }
                    gm.mess(res);
                  }
                );
              }
            }
          }
        } catch (e) {
          console.log(e.message);
        }
      }
    });
  };

  // 成功支付之后
  function paySuccess() {
    gm.go('/order/pay-success.html?orderno=' + orderno + '&fees=' + fees);
  };

  // 绑定支付，目前只有微信支付，直接绑定即可
  function bindSubmit() {
    $btnSubmit.addEventListener(ice.tapClick, function(e) {
      callpay();
    });
  };

  // 加载订单信息
  function initOrder() {
    gm.session.set('pay', '1');

    // 判断订单信息
    if (porder != null && orderno != null && porder == orderno) {
      $prodFees.innerHTML = fees;
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
