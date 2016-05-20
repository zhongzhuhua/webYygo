define(function(require, exports, module) {
  var gm = require('global').login();
  var ice = gm.ice;

  var pid = ice.request('pid');

  // 产品信息
  var $prodName = ice.query('#prodName');
  var $prodNumber = ice.query('#prodNumber');
  var $prodMess = ice.query('#prodMess');
  var $prodPrice = ice.query('#prodPrice');
  var $prodNow = ice.query('#prodNow');
  var $prodNeed = ice.query('#prodNeed');
  var $prodProcess = ice.query('#prodProcess');
  var $prodImgInfo = ice.query('#prodImgInfo');
  // 购物车按钮
  var $prodButtons = ice.query('#prodButtons');
  ice.query('#btnCar').setAttribute('data-value', pid);
  ice.query('#btnBuy').setAttribute('data-value', pid);

  // 查询产品信息
  function search(init) {
    if (pid == '') {
      gm.go();
    }

    var layer = gm.loading();

    ice.ajax({
      url: gm.path + '/prod/findProd.php?id=' + pid,
      cache: false,
      dataType: 'json',
      success: function(data) {
        gm.ajaxMsg(data);
        try {
          if (data.status == '0') {
            data = data.data;

            console.log(data);
            var price = data.prod_price;
            var nprice = ice.parseInt(data.now_price);
            var ndprice = ice.parseInt(price - nprice);
            var proc = ice.parseInt(nprice / price * 100);

            // 赋值
            $prodName.innerHTML = data.name;
            $prodNumber.innerHTML = data.ordernum;
            $prodMess.innerHTML = ice.toEmpty(data.info);
            $prodPrice.innerHTML = data.prod_price;
            $prodNow.innerHTML = nprice;
            $prodNeed.innerHTML = ndprice;
            $prodProcess.style['width'] = proc + '%';

            // 图文详情
            var img = ice.toEmpty(data.img_info);
            if(img != '') {
              $prodImgInfo.setAttribute('href', '/html/prod/imginfo.html?img=' + encodeURIComponent(img))
            } else {
              $prodImgInfo.addEventListener(ice.tapClick, function (e) {
                gm.mess('该产品暂无图文详情');
              });
            }

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
    gm.bindScroll(gm.refresh, null);

    // 加入购物车
    gm.car.bindAdd($prodButtons);

  })();
});
