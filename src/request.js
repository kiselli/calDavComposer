var http = require('http');
var https = require('https');
var Q = require('q');


function requestCalendar(url){
  var client = url.indexOf('https') === 0 ? https : http;
  return Q.promise(function(respond,reject){
    client.get(url,function(res){

      var data = "";
      res.on('data',function(chunk){
        data+=chunk;
      });
      res.on('end',function(){
          respond(data);
      });

    }).on('error',function(e){
      console.log("Error Request: "+e.message);
      reject(e);
    })
  })
}


function requestAll(urls){
	var promises = [];
	for (var i = 0; i<urls.length;i++){
	  var url = urls[i];
	  var promise = requestCalendar(url);
	    promises.push(promise);
	}
  return promises;
}

module.exports = {
	one: requestCalendar,
	all: requestAll
};
