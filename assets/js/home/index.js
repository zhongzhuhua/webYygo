define(function(require, exports, module) {
  var gm = require('global');
  var ice = gm.ice;

  gm.bindScroll(null, function() {
    console.log('more');
  });
});