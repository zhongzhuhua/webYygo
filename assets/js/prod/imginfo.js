define(function(require, exports, module) {
  var gm = require('global').login();
  var ice = gm.ice;

  var $img = ice.query('#img');
  var img = decodeURIComponent(ice.request('img'));

  // 初始化
  (function() {

    var layer = gm.loading();
    var dom = document.createElement('img');
    dom.style['width'] = '100%';
    dom.src = img;
    dom.onload = function() {
      $img.appendChild(dom);
      gm.close(layer);
    };

    dom.onerror = function() {
      gm.message('该产品图文详情无效');
    };


    // 绑定滑动事件
    gm.bindScroll(gm.refresh, null);

  })();
});
