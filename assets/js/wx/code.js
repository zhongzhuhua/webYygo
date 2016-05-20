define(function(require, exports, module) {
  var gm = require('global');
  var ice = gm.ice;

  var _loginErr = '登录失败，请退出重试！';

  // 用户登录
  function login() {
    var mydata = {
      code: ice.request('code')
    };

    // 登录注册
    ice.ajax({
      url: gm.path + '/wechat/doLogin.php',
      data: mydata,
      type: 'post',
      dataType: 'json',
      success: function(data) {
        try {
          console.log(data);
          var status = data.status;
          var isLogin = data.data;
          if(status == '0') {
            if (isLogin != null && isLogin == '1') {
              gm.session.set('isLogin', isLogin);

              // 成功登录之后跳转
              var redirect = gm.session.get('redirect');
              redirect = redirect != null ? decodeURIComponent(redirect) : '/';
              gm.go(redirect);
            } else {
              gm.mess(_loginErr); 
            }
          } else {
            gm.mess(_loginErr); 
          }
        } catch (e) {
          gm.mess(_loginErr);
        }
      }
    });
  };

  // 初始化
  (function() {
    var isLogin = ice.toEmpty(gm.session.get('isLogin'));
    if (isLogin != '1') {
      login();
    } else {
      var redirect = gm.session.get('redirect');
      redirect = redirect != null ? decodeURIComponent(redirect) : '/';
      gm.go(redirect);
    }
  })();
});
