define(function(require, exports, module) {
  var gm = require('global').login();
  var ice = gm.ice;

  // var $list = ice.query('#list');
  // var listTemp = ice.query('#listTemp').innerHTML;

  // 查询购物车
  function search(init) {
    // var layer = null;
    // if (init == '1') {
    //   layer = gm.loading();
    //   $list.innerHTML = '';
    //   gm.scrollLoad('i');
    // }
    // gm.close(layer);
  };

  // 初始化
  (function() {
    // 初始化
    search(1);

    // 绑定滑动事件
    gm.bindScroll(null, null);

    // 焦点图事件
    ice.slider({
      data: [{
        link: null,
        img: 'http://172.16.72.30:9667/image/1.jpg',
      }, {
        link: null,
        img: 'http://172.16.72.30:9667/image/2.jpg',
      }, {
        link: null,
        img: 'http://172.16.72.30:9667/image/3.jpg',
      }]
    });
  })();
});
