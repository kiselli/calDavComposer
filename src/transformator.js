var Q = require('q');

function extractEvents(raw){
  var beginIndex = raw.indexOf('BEGIN:VEVENT');
  var endIndex = raw.lastIndexOf('END:VEVENT')+'END:VEVENT'.length;
  return raw.substring(beginIndex,endIndex);
}

function transformPromise(promise){
  return promise.then(function onRespond(raw){
    return extractEvents(raw);
  })
}

function transformPromises(promises){
  return promises.map(function(promise){
    return transformPromise(promise);
  })
}

function compose(promises, name){
  name = name == undefined ? 'Default' : name;

  var head = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:ownCloud Calendar 0.6.4\nX-WR-CALNAME:"+name+"\n";
  var tail = '\nEND:VCALENDAR';

  return Q.promise(function(respond){
    Q.all(promises)
    .then(function(chunks){

      // chunks = array of promise responds
      var composed = chunks.join("\n");
      var calendar = head + composed + tail;      

      respond(calendar);
    })
  })
}

module.exports = {
  extractOne: transformPromise,
  extractAll: transformPromises,
  compose: compose
};
