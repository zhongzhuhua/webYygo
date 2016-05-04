define(function(require, exports, module) {
  var gm = require('global');
  var ice = gm.ice;
 
  var _loginErr = '登录失败，请退出重试！';

  // 用户登录
  function login() {
    gm.ajax({
      url: '/action/wechat/doLogin.php',
      data: {
        code: ice.request('code')
      },
      success: function (data) {
        try {
          var openid = data.openid;
          if(openid != null && openid != '') {
            gm.session.set('openid', openid);

            // 成功登录之后跳转
            var redirect = gm.session.get('redirect');
            redirect = redirect != null ? decodeURIComponent(redirect) : '/';
            gm.go(redirect);
          } else {
            gm.mess(_loginErr);  
          }
        } catch(e) {
          gm.mess(_loginErr);
        }
      }
    });
  };

  // 初始化
  (function() {
    login();
  })();
});