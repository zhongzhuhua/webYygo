define(function(require, exports, module) {
  require('layer');

  // 域名和端口
  var _host = location.host;
  // 是否测试
  var _istest = _host.indexOf(':') > -1;

  // 公用配置
  var configs = {
    // 获取公众号 appid
    appid: function() {
      if (_istest) {
        return 'wxea3db525582377d1';
      } else {
        return 'wx2bb7a8b9edef392a';
      }
    },
    // 获取请求路径
    path: function() {
      return '';
    }
  };

  // 微信登录
  if ('sessionStorage' in window) {
    var openid = ice.toEmpty(sessionStorage.getItem('openid'));
    if (openid == '') {
      var state = encodeURIComponent(location.href);
      var redirect = 'http://' + _host + '/html/wx/code.html';
      console.log('https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + configs.appid() + '&redirect_uri=' + redirect + '&response_type=code&scope=snsapi_base&state=1&connect_redirect=1#wechat_redirect');
      //location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + configs.appid() + '&redirect_uri=' + redirect + '&response_type=code&scope=snsapi_userinfo&state=' + state + '#wechat_redirect';
    }
  }

  // 公用调用
  var domMain = ice.query('.ice-main');
  var domArrow = ice.query('.ice-main .i-hide');
  var domRefresh = ice.query('.ice-refresh');

  // 插件
  exports.ice = ice;

  // 获取不含 # 之后的整个 url
  exports.getUrl = function() {
    return location.href.split('#')[0];
  };

  // 重新加载
  function _reload() {
    location.reload();
  };
  exports.reload = _reload;

  // 打开弹窗
  exports.open = function(content) {
    return layer.open({
      style: 'padding: 0;',
      content: content
    });
  };

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
  function _mess(m) {
    return layer.open({
      shade: false,
      className: 'ice-mess',
      content: (m == null || m == '' ? '操作成功' : m),
      time: 3
    });
  };
  exports.mess = _mess;

  // 绑定下拉刷新
  exports.bindScroll = function(ref, more) {
    if(ref == null) {
      ref = _reload;
    }
    ice.scrollY(domMain, {
      arrow: domArrow,
      refresh: domRefresh,
      refreshFun: ref,
      loadFun: more
    });
  };

  // 最后一页
  exports.scrollEnd = function() {
    ice.addClass(domRefresh, 'i-last');
  };

  // 重置分页
  exports.scrollStart = function() {
    ice.removeClass(domRefresh, 'i-last');
  };

  // 统一 ajax
  function _ajax(o) {
    o = o == null ? {} : o;
    ice.ajax({
      url: o.url,
      type: 'post',
      cache: false,
      dataType: 'json',
      data: o.data == null ? {} : o.data,
      async: o.async,
      success: function(data) {
        // 公用处理
        if (ice.isFunction(o.success)) {
          o.success(data);
        }
      }
    });
  };
  exports.ajax = _ajax;
});
