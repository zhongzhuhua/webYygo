define(function(require, exports, module) {
  var gm = require('global').login();
  var ice = gm.ice;

  var $carNone = ice.query('#carNone');
  var $list = ice.query('#list');
  var listTemp = ice.query('#listTemp').innerHTML;
  var _layer = null;

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
        url: gm.path + '/action/order/car.php',
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
              var nprice = ice.parseInt(model.now_price);
              var num = model.ordernum;
              var proc = price == 0 ? 100 : ice.parseInt(nprice / price);
              html += listTemp.replace(/{{pid}}/g, pid).replace(/{{nprice}}/g, nprice).replace('{{num}}', num).replace('{{process}}', proc).replace('{{price}}', price).replace('{{name}}', name).replace('{{img}}', img);
            }
            var dom = document.createElement('div');
            dom.innerHTML = html;
            $list.appendChild(dom);

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

  // 空购物车
  function carNone(num) {
    if(num == null || num == '' || num <= '0') {
      ice.removeClass($carNone, 'hidden');
    }
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
    } else if (v >= max) {
      v = max;
      gm.mess('最多可参与' + max + '人次');
    }
    $input.value = v;
  };

  // 初始化
  (function() {

    // 初始化
    search(1);

    // 绑定滑动事件
    gm.bindScroll(null, null);
    
  })();
});
