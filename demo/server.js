var http = require('http')
var url = require('url')
var composer = require('../')
var config = require('./config')

var baseDirectory = __dirname   // or whatever base directory you want

http.createServer(function (request, response) {
   var requestUrl = url.parse(request.url)
   var fsPath = baseDirectory+requestUrl.pathname

   composer.composeFromUrls(config.calendars).then(function(calendar){
   	response.writeHead(200, {'Content-Type': 'text/calendar'})
   	response.end(calendar);
   })
}).listen(config.port)