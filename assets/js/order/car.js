define(function(require, exports, module) {
  var gm = require('global').login();
  var ice = gm.ice;

  var $list = ice.query('#list');
  var listTemp = ice.query('#listTemp').innerHTML;
  var _layer = null;

  // 查询列表
  var next = true;

  function search(init) {
    var layer = null;
    if (init) {
      // layer = gm.loading();
      $list.innerHTML = '';
    }
    var html = '';
    var len = 10;
    for (var i = 0; i < len; i++) {
      var name = '苹果手机苹果手机苹果手机苹果手机苹果手机';
      var img = gm.buildImage();
      var price = '5288.00';
      var surplus = '2800';
      var num = i;
      var proc = 20;
      var id = 'o' + new Date().getTime() + i;
      html += listTemp.replace('{{id}}', id).replace('{{num}}', num).replace(/{{surplus}}/g, surplus).replace('{{name}}', name).replace('{{img}}', img).replace('{{price}}', price);
    }
    var dom = document.createElement('div');
    dom.innerHTML = html;
    $list.appendChild(dom);
    gm.scrollLoad(!!next);

    bindOpe();
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
            removeProd(dom);
          });
        });

        $input.addEventListener('change', function() {
          opeNumber($input);
        });
      })($doms[i]);
    };
  };

  // 删除产品
  function removeProd(dom) {
    if(dom) {
      var id = dom.getAttribute('data-value');
      gm.car.remove(id);
      dom.parentNode.removeChild(dom);
    }
    gm.close(_layer, 0);
  };

  // 操作数字
  function opeNumber($input, num) {
    var v = 0;
    var max = ice.parseInt($input.getAttribute('max-value'));
    if(num == null) {
      v = ice.parseInt($input.value);
    } else {
      v = ice.parseInt($input.value) + num;  
    }
    if(v <= 0) {
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
