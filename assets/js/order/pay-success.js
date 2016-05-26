define(function(require, exports, module) {
  var gm = require('global').login();
  var ice = gm.ice;
  
  // 数据
  var orderno = ice.query('orderno');
  var fees = ice.parseInt(ice.query('fees'));
  
  // 控件
  var $orderno = ice.query('#orderno');
  var $fees = ice.query('#fees');
  var $msg = ice.query('#msg');

  // 结果
  var $paySuccess = ice.queryAll('#result .col-green');
  var $payError = ice.queryAll('#result .col-red');

  // 初始化订单
  function initOrder() {
  	layer = gm.loading();
  	$orderno.innerHTML = orderno;
  	$fees.innerHTML = fees;

  	// 付款成功
  	if($orderno != null) {
  		ice.ajax({
  			url: gm.path + '/wechat/paySuccess.php',
  			type: 'post',
  			data: {
  				orderno: orderno
  			},
  			cache: false,
  			dataType: 'json',
  			success: function(data) {
  				try {
  					if(data.status != '0') {
  						$msg.innerHTML = data.msg;
  						ice.removeClass($msg.parentNode, 'hidden');
  						ice.removeClass($payError, 'hidden');
  					} else {
  						ice.removeClass($paySuccess, 'hidden');
  					}
  				} catch(e) {
  					console.log(e.message);
  				}

  				gm.close(layer);
  			},
  			error: function() {
  				gm.close(layer);
  			}
  		});
  	}
  };

  // 初始化
  (function() {
  	initOrder();
  })();
});