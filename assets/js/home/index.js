define(function(require, exports, module) {
  var gm = require('global').login();
  var ice = gm.ice;

  var $list = ice.query('#list');
  var listTemp = ice.query('#listTemp').innerHTML;

  // 查询列表
  var next = true;
  function search(init) {
    var layer = null;
    if(init) {
      // layer = gm.loading();
      $list.innerHTML = '';
    }
    var html = '';
    var len = 6;
    for (var i = 0; i < len; i++) {
      var name = '苹果手机苹果手机苹果手机苹果手机苹果手机';
      var img = gm.buildImage();
      var price = '5288.00';
      var num = i;
      var proc = 20;
      html += listTemp.replace('{{num}}', num).replace('{{process}}', proc).replace('{{name}}', name).replace('{{img}}', img).replace('{{price}}', price);
    }
    var dom = document.createElement('div');
    dom.innerHTML = html;
    $list.appendChild(dom);
    gm.scrollLoad(!!next);
  };

  // 初始化
  (function() {
    // 初始化
    search(1);

    // 顶部菜单
    gm.navChoose(function() {
      search(1);
    });

    // 绑定滑动事件
    gm.bindScroll(null, function() {
      search()
    });

  })();
});
