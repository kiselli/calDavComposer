var http = require('http')
var url = require('url')
var composer = require('../')
var config = require('./config')

if(config.allowSelfSignedCertificate){
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

var baseDirectory = __dirname   // or whatever base directory you want

http.createServer(function (request, response) {
	try{
	   composer.composeFromUrls(config.calendars).then(function(calendar){
	   	response.writeHead(200, {'Content-Type': 'text/calendar'})
	   	response.end(calendar);
	   })
	}catch(e){
		response.writeHead(500);
		response.end();
	}
}).listen(config.port)
console.log("CalDav Demo listening on port "+config.port)