define(function(require, exports, module) {
  require('layer');

  // ajax 数据
  exports.path = '/action';
  // 域名和端口
  var _host = location.host;
  // 是否测试
  var _istest = _host.indexOf(':') > -1;

  // 公用配置
  var _configs = {
    // 获取公众号 appid
    appid: function() {
      if (_istest) {
        return 'wxea3db525582377d1';
      } else {
        return 'wx5b08cfd22ea4c57e';
      }
    },
    // 获取请求路径
    path: function() {
      return '';
    }
  };

  // 设置 session [openid][redirect]
  var _session = {
    set: function(k, v) {
      if (!ice.isEmpty(k)) {
        sessionStorage.setItem(k, ice.toEmpty(v));
      }
    },
    get: function(k) {
      return ice.isEmpty(k) ? '' : sessionStorage.getItem(k);
    }
  };
  exports.session = _session;

  // 设置 application [shopcar]
  var _app = {
    set: function(k, v) {
      if (!ice.isEmpty(k)) {
        localStorage.setItem(k, ice.toEmpty(v));
      }
    },
    get: function(k) {
      return ice.isEmpty(k) ? '' : localStorage.getItem(k);
    }
  };
  exports.app = _app;

  // 微信登录
  function _login() {
    var isLogin = ice.toEmpty(_session.get('isLogin'));

    if (isLogin != '1') {

      // 登录成功后指向的地址
      _session.set('redirect', encodeURIComponent(location.href));

      // 微信跳转地址
      var redirect = 'http://' + _host + '/html/wx/code.html';

      // 跳转获取用户 code 值
      var href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + _configs.appid() + '&redirect_uri=' + redirect + '&response_type=code&scope=snsapi_base&state=1#wechat_redirect';

      // 测试下只要输出
      if (ice.request('__ice__') == '1') {
        console.log(href);
      } else {
        location.href = href;
      }
    }

    return this;
  };

  exports.login = _login;

  // 公用调用 绑定下拉刷新
  var _domScroll = ice.query('.ice');
  var _domRefresh = ice.query('.ice-refresh');
  var _mytimer = null;
  var $_load = ice.query('.ice-load');

  if ($_load) {
    $_load.innerHTML = '上拉加载更多';
  }

  // 刷新
  exports.refresh = function() {
    location.reload();
  };

  exports.bindScroll = function(_reload, _load) {
    ice.scrollY(_domScroll, {
      refreshFun: _reload,
      loadFun: function() {},
      endFun: function(dom, load) {
        var textArr = ['.', '..', '...', '....'];
        if (load && dom.getAttribute('scroll-load') == '1') {
          var idx = 0;
          clearInterval(_mytimer);
          _mytimer = setInterval(function() {
            try {
              if (idx == 100) {
                scrollLoadded();
              }
              $_load.innerHTML = '数据加载中' + textArr[idx % 4];
              idx++;
            } catch (e) {
              clearInterval(_mytimer);
            }
          }, 200);

          setTimeout(function() {
            if (ice.isFunction(_load)) {
              _load();
            }
          }, 1000);
        }
      }
    });
  };

  // 加载完成 type='i'[初始化] type=false[结束] type=other[普通]
  function scrollLoad(type) {
    if ($_load) {
      clearInterval(_mytimer);
      if (type === false) {
        ice.scrollY.stop(_domScroll);
        $_load.innerHTML = '已经加载全部数据';
      } else if (type == 'i') {
        ice.scrollY.start(_domScroll);
        $_load.innerHTML = '上拉加载更多';
      } else {
        $_load.innerHTML = '上拉加载更多';
      }
    }
  };
  exports.scrollLoad = scrollLoad;

  // 插件
  exports.ice = ice;

  // 获取不含 # 之后的整个 url
  exports.getUrl = function() {
    return location.href.split('#')[0];
  };

  // 跳转
  function _go(url) {
    location.href = url == null || url == '' ? '/html/home/index.html' : url;
  };
  exports.go = _go;

  // 重新加载
  function _reload() {
    location.reload();
  };
  exports.reload = _reload;

  // 打开弹窗
  function _open(content, tit) {
    return layer.open({
      title: tit,
      style: 'padding: 0;',
      content: content
    });
  };
  exports.open = _open;

  // 提示
  exports.alert = function(content, callback) {
    return layer.open({
      content: content,
      btn: ['朕知道了'],
      yes: function(index) {
        if (ice.isFunction(callback)) {
          callback();
        } else {
          layer.close(index);
        }
      }
    });
  };

  // 确认
  exports.confirm = function(content, ok, no) {
    return layer.open({
      content: content,
      btn: ['确认', '取消'],
      shadeClose: false,
      yes: ok,
      no: no
    });
  };

  // 加载中
  function _loading(mess) {
    return layer.open({
      type: 2,
      time: 4,
      content: mess == null ? '加载中' : mess
    });
  };
  exports.loading = _loading;

  // 关闭弹窗
  function _close(l, t) {
    if (l !== null) {
      setTimeout(function() {
        layer.close(l)
      }, (t == null ? 800 : t));
    }
  };
  exports.close = _close;

  // 提示信息
  function _mess(m, t) {
    return layer.open({
      shade: false,
      className: 'alert-mess',
      content: (m == null || m == '' ? '操作成功' : m),
      time: t == null ? 3 : t
    });
  };
  exports.mess = _mess;

  // 弹出选择
  exports.select = function(m) {
    if (m != null && m != '') {
      return layer.open({
        type: 1,
        content: m,
        anim: 0,
        style: 'position:fixed; top:0; bottom:0; left:0; width:100%; border:none;'
      });
    }
  };

  // 获取 # 后面的数字
  function _getHashCode() {
    return ice.parseInt(location.hash.replace('#', ''))
  };
  exports.getHashCode = _getHashCode;

  // 切换顶部 nav 
  exports.navChoose = function(success) {
    ice.choose({
      selector: '#nav',
      children: 'a',
      chooseClass: 'choose',
      chooseIndex: _getHashCode(),
      success: success
    });
  };

  // 转成 img
  exports.buildImage = function(img, alt) {
    img = img == null || img == '' ? '/assets/images/zbit.png' : img;
    alt = alt == null ? '1元购' : alt;
    return '<img src="' + img + '" alt="' + alt + '" />'
  };

  // 购物车
  var $shopcar = ice.query('#shopcar');
  var _car = {
    // 初始化
    init: function() {
      return _car.setNum(_car.get());
    },
    // 设置数量
    setNum: function(car) {
      if ($shopcar && car && car != '') {
        var arrs = car.replace(/^\|/, '').replace(/\|$/, '').split('|');
        var len = arrs.length;
        $shopcar.innerHTML = len;
        return len;
      }
      return 0;
    },
    // 删除购物车产品
    remove: function(id) {
      id = ice.trim(ice.toEmpty(id));
      if (id != '') {
        id = id + '|';
        var car = _car.get();
        if (car != '') {
          car = car.replace(id, '');
          return _car.set(car);
        }
      }
      return 0;
    },
    // 获取购物车内容
    get: function() {
      var car = _app.get('shopcar');
      return ice.toEmpty(car);
    },
    // 设置购物车内容
    set: function(car) {
      if (car != null) {
        _app.set('shopcar', car);
        return _car.setNum(car);
      }
      _app.set('shopcar', '');
      return 0;
    },
    // 绑定添加事件，必须是 class="icon-car" 的父元素
    bindAdd: function($dom) {
      if ($dom) {
        $dom.addEventListener(ice.tapClick, function(e) {
          var ele = e.srcElement;
          var clz = ele.className;
          if (clz && (clz == 'icon-car' || clz.indexOf('car-add') > -1 || clz.indexOf('car-buy') > -1)) {
            // 添加产品到购物车
            var car = _car.get();
            var val = ice.toEmpty(ele.getAttribute('data-value'));
            if (val != '') {
              var val = val + '|';
              if (car.indexOf(val) <= -1) {
                car += val;
                _car.set(car);
              }

              // 立即云购的就跳转到购物车
              if (clz.indexOf('car-buy') > -1) {
                _go('/html/order/car.html');
              }
            }
          }
        });
      }
    }
  };
  exports.car = _car;

  // 分页
  exports.cfgPage = {
    index: 1,
    size: 20,
    time: ice.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss')
  };

  // 公用提示
  exports.ajaxMsg = function(data) {
    try {
      if (data != null) {
        if (typeof data == 'string' && data != '') {
          _mess(data);
        } else {
          if (data.status != '-1') {
            var msg = ice.toEmpty(data.msg);
            if (msg != '') {
              _mess(data.msg);
            }

            // 如果需要重新登录
            if (data.status == '2') {
              _session.set('isLogin', '0');
              _login();
            }
          }
        }
      }
    } catch (e) {}
  };

  // 公用按钮处理
  exports.isSubmit = function($btn, sub) {
    if (sub) {
      ice.removeClass($btn, 'btn-disabled');
    } else {
      ice.addClass($btn, 'btn-disabled');
    }
    return sub;
  };

  // 公用初始化事件
  (function() {
    _car.init();

    // 公用分享
    var $share = ice.query('.share');
    if ($share) {
      $share.addEventListener(ice.tapClick, function(e) {
        ice.stopDefault(e);
        layer.open({
          content: '<img src="/assets/images/share.png" style="width: 10rem; height: 5rem; float: right; padding-right: 2rem; padding-top: .5rem" />',
          style: 'position:fixed; top:0; right:0; box-shadow: none; background-color: transparent;'
        });
      });
    }
  })();
});
