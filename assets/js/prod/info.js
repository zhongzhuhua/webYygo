define(function(require, exports, module) {
  var gm = require('global').login();
  var ice = gm.ice;

  var pid = ice.request('pid');

  // 产品信息
  var $prodName = ice.query('#prodName');
  var $prodNumber = ice.query('#prodNumber');
  var $prodMess = ice.query('#prodMess');

  // 查询产品信息
  function search(init) {
    if (pid == '') {
      gm.go();
    }

    var layer = gm.loading();

    ice.ajax({
      url: gm.path + '/action/prod/findProd.php?id=' + pid,
      cache: false,
      dataType: 'json',
      success: function(data) {
        gm.ajaxMsg(data);
        try {
          if (data.status == '0') {
            data = data.data;

            $prodName.innerHTML = data.name;
            $prodNumber.innerHTML = data.ordernum;
            $prodMess.innerHTML = ice.toEmpty(data.info);

            // 图片焦点图
            bindImageSlider(data.img_paths.split('|'));
          }
        } catch (e) {
          console.log(e.message);
        }
        gm.close(layer);
      }
    });

  };

  // 绑定图片焦点图
  function bindImageSlider(imgs) {
    var len = imgs.length;
    var options = {
      data: []
    };
    for (var i = 0; i < len; i++) {
      var img = imgs[i];
      if (img == null || img == '') continue;
      options.data.push({
        link: null,
        img: imgs[i]
      });
    }

    ice.slider(options);
  };

  // 初始化
  (function() {

    // 初始化
    search(1);

    // 绑定滑动事件
    gm.bindScroll(null, null);

  })();
});
