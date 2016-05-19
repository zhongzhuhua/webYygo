define(function(require, exports, module) {
  var gm = require('global').login();
  var ice = gm.ice;

  var $list = ice.query('#list');
  var listTemp = ice.query('#listTemp').innerHTML;
  var typeLayer = null;
  
  // 查询列表
  var mydata = {
    sortType: gm.getHashCode(),
    type: '',
    index: gm.cfgPage.index,
    size: gm.cfgPage.size,
    time: gm.cfgPage.time
  };
  var next = true;

  // 查询列表
  function search(init) {
    var layer = null;
    if (init == '1') {
      layer = gm.loading();
      $list.innerHTML = '';
      gm.scrollLoad('i');
      mydata.index = 1;
    }
    console.log(mydata);

    ice.ajax({
      url: gm.path + '/action/order/page.php',
      cache: false,
      data: mydata,
      dataType: 'json',
      success: function(data) {
        gm.ajaxMsg(data);
        try {
          var html = '';
          var list = data.data;
          var len = list == null ? 0 : list.length;
          next = len > mydata.size;
          len = len > mydata.size ? mydata.size : len;
          mydata.index++;

          for (var i = 0; i < len; i++) {
            var model = list[i];
            var pid = model.pid;
            var orderno = model.orderno;
            var name = model.name;
            var img = gm.buildImage(model.img_path);
            var price = model.prod_price;
            var nprice = model.now_price;
            var num = model.ordernum;
            var proc = ice.parseInt(nprice / price * 100);
            html += listTemp.replace(/{{pid}}/g, pid).replace('{{num}}', num).replace('{{process}}', proc).replace('{{price}}', price).replace('{{name}}', name).replace('{{img}}', img);
          }
          var dom = document.createElement('div');
          dom.innerHTML = html;
          $list.appendChild(dom);
          gm.scrollLoad(!!next);
        } catch (e) {
          console.log(e.message);
        }
        gm.close(layer);
      }
    });
  };

  // 顶部菜单
  function navTop() {
    var $navSort = ice.query('#navSort');
    var $navType = ice.query('#navType');
    var winType = ice.query('#winType').innerHTML;

    // 选择事件
    gm.navChoose(function($dom) {
      var val = $dom.getAttribute('data-value');
      if((mydata.sortType == '3' || mydata.sortType == '4') && (val == '3' || val == '4')) {
        if(mydata.sortType == '3') {
          val = '4';
        } else {
          val = '3';
        }
      }
      if($navSort) {
        if(val == '3') {
          $navSort.innerHTML = '∨';
        } else if(val == '4') {
          $navSort.innerHTML = '∧';
        } else {
          $navSort.innerHTML = '&nbsp;';
        }
      }
      mydata.sortType = ice.parseInt(val);
      search(1);
    });

    // 分类
    $navType.addEventListener(ice.tapClick, function() {
    typeLayer = gm.open(winType, '选择分类');
      var $type = ice.query('.layermcont .win-type');
      $type.addEventListener('click', function(e) {
        var ele = e.srcElement;
        var clz = ele.className;
        if (clz != null && clz.indexOf('cell') == 0) {
          var val = ice.toEmpty(ele.getAttribute('data-value'));
          var text = ice.toEmpty(ele.innerHTML);
          $navType.innerHTML = val != '' ? text : $navType.getAttribute('data-text');
          mydata.type = val;
          gm.close(typeLayer, 0);
          search(1);
        }
      });
    });
  };

  // 初始化
  (function() {

    // 初始化
    search(1);

    // 绑定滑动事件
    gm.bindScroll(null, function() {
      search()
    });

    // 顶部菜单
    navTop();

    // 加入购物车
    gm.car.bindAdd($list);
    
  })();
});
