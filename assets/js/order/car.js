define(function(require, exports, module) {
  var gm = require('global').login();
  var ice = gm.ice;

  var $carNone = ice.query('#carNone');
  var $list = ice.query('#list');
  var listTemp = ice.query('#listTemp').innerHTML;
  var _layer = null;

  // 购物车详情
  var $carCount = ice.query('#carCount');
  var $carPrice = ice.query('#carPrice');
  var $inputs = null;
  var inputLen = 0;

  // 结算按钮
  var $btnSubmit = ice.query('#btnSubmit');
  var isSubmit = false;

  // 查询购物车
  function search(init) {
    var layer = null;
    if (init == '1') {
      layer = gm.loading();
      $list.innerHTML = '';
      gm.scrollLoad('i');
    }

    var ids = gm.car.get();
    if (ids == null || ids == '') {
      gm.close(layer);
      carNone(0);
    } else {
      ice.ajax({
        url: gm.path + '/order/car.php',
        cache: false,
        data: {
          ids: ids
        },
        dataType: 'json',
        success: function(data) {
          var carNum = 0;
          gm.ajaxMsg(data);
          try {
            var html = '';
            var list = data.data;
            var len = list == null ? 0 : list.length;
            var car = '';

            for (var i = 0; i < len; i++) {
              var model = list[i];
              var pid = model.pid;
              car += pid + '|';
              var orderno = model.orderno;
              var name = model.name;
              var img = gm.buildImage(model.img_path);
              var price = ice.parseInt(model.prod_price);
              var nprice = price - ice.parseInt(model.now_price);
              var num = model.ordernum;
              var proc = price == 0 ? 100 : ice.parseInt(nprice / price);
              html += listTemp.replace('{{orderno}}', orderno).replace(/{{pid}}/g, pid).replace(/{{nprice}}/g, nprice).replace('{{num}}', num).replace('{{process}}', proc).replace('{{price}}', price).replace('{{name}}', name).replace('{{img}}', img);
            }
            var dom = document.createElement('div');
            dom.innerHTML = html;
            $list.appendChild(dom);

            $inputs = $list.getElementsByTagName('input')

            // 绑定操作事件
            bindOpe();
            gm.car.set(car);
            carNum = gm.car.init();
          } catch (e) {
            console.log(e.message);
          }
          gm.close(layer);
          carNone(carNum);
        }
      });
    }
  };

  // 绑定加减
  function bindOpe() {
    var $doms = ice.queryAll('.row', $list);
    var len = $doms == null ? 0 : $doms.length;
    for (var i = 0; i < len; i++) {
      (function(dom) {
        var $min = ice.query('.min', dom);
        var $add = ice.query('.add', dom);
        var $input = ice.query('input', dom);
        var $del = ice.query('.delete', dom);

        $min.addEventListener(ice.tapClick, function() {
          opeNumber($input, -1);
        });

        $add.addEventListener(ice.tapClick, function() {
          opeNumber($input, 1);
        });

        $del.addEventListener('click', function() {
          _layer = gm.confirm('<div style="padding: 1em 2em;">您确定抛弃该产品吗？</div>', function() {
            removeProd(dom, $input);
          });
        });

        $input.addEventListener('change', function() {
          opeNumber($input);
        });
      })($doms[i]);
    };
  };

  // 是否空购物车，设置共计产品数
  function carNone(num) {
    if (num == null || num == '' || num <= '0') {
      ice.removeClass($carNone, 'hidden');
    }

    deelCarInfo();
  };

  // 合计产品金额和数量
  function deelCarInfo() {
    var len = $inputs ? $inputs.length : 0;
    var price = 0;

    for (var i = 0; i < len; i++) {
      price += ice.parseInt($inputs[i].value);
    }
    $carPrice.innerHTML = price;
    $carCount.innerHTML = len;

    // 如果产品个数大于0则按钮可以点击
    isSubmit = gm.isSubmit($btnSubmit, (len > 0));
    inputLen = len;
  };

  // 删除产品
  function removeProd(dom, input) {
    var carNum = 0;
    if (dom) {
      var id = input.getAttribute('data-value');
      carNum = gm.car.remove(id);
      dom.parentNode.removeChild(dom);
    }

    carNone(carNum);
    gm.close(_layer, 0);
  };

  // 操作数字
  function opeNumber($input, num) {
    var v = 0;
    var max = ice.parseInt($input.getAttribute('max-value'));
    if (num == null) {
      v = ice.parseInt($input.value);
    } else {
      v = ice.parseInt($input.value) + num;
    }
    if (v <= 0) {
      v = 1;
      gm.mess('至少参与1人次');
    } else if (v > max) {
      v = max;
      gm.mess('最多可参与' + max + '人次');
    }
    $input.value = v;

    deelCarInfo();
  };

  // 绑定提交按钮
  function bindSubmit() {
    $btnSubmit.addEventListener(ice.tapClick, function(e) {
      ice.stopDefault(e);
      mySubmit();
    });
  };

  // 提交订单
  function mySubmit() {
    if (!isSubmit && inputLen > 0) return;
    isSubmit = gm.isSubmit($btnSubmit, false);

    var prods = '';
    for (var i = 0; i < inputLen; i++) {
      var oid = $inputs[i].getAttribute('orderno');
      var num = $inputs[i].value;
      prods += '|' + oid + '=' + num;
    }

    console.log(prods);
    gm.mess('订单提交中，请稍后...');

    ice.ajax({
      url: gm.path + '/order/add.php',
      type: 'post',
      data: {
        prods: prods
      },
      dataType: 'json',
      success: function(data) {
        gm.ajaxMsg(data);
        try {
          var status = data.status;
          var model = data.data;
          var orderno = ice.toEmpty(model.orderno);
          var fees = ice.parseInt(model.fees);

          if(status == '0') {
            if(orderno == '' || fees <= 0) {
              gm.mess('订单信息异常，请刷新重试');
            } else {
              gm.session.set('payOrder', orderno);
              gm.session.set('payFees', fees);
              gm.go('/html/order/pay.html?orderno=' + orderno);
            }
          }
        } catch(e) {
          gm.mess(e.message);
        }

        isSubmit = gm.isSubmit($btnSubmit, true);
      },
      error: function() {
        isSubmit = gm.isSubmit($btnSubmit, true);
      }
    });
  };

  // 初始化
  (function() {

    // 初始化
    search(1);

    // 绑定提交
    bindSubmit();

    // 绑定滑动事件
    gm.bindScroll(gm.refresh, null);

  })();
});
