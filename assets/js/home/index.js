define(function(require, exports, module) {
  var gm = require('global').login();
  var ice = gm.ice;
 
  // 初始化
  (function() {

    // 绑定滑动事件
    gm.bindScroll(null, function() {
      console.log('more');
    });

  })();
});