var Q = require('q');

var request = require('./src/request');
var transformator = require('./src/transformator');


function composeFromUrls(urls, name){



  var all = request.all(urls);

  var transformed = transformator.extractAll(all);

  return transformator.compose(transformed,name);

}


module.exports = {
  composeFromUrls: composeFromUrls
};
