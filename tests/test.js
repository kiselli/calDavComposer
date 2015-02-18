var urls =
['http://oliver:01bd15cc27879709df37ec2bf4f860ed@213.136.79.13/owncloud/index.php/apps/calendar/export.php?calid=3',
'http://oliver:01bd15cc27879709df37ec2bf4f860ed@213.136.79.13/owncloud/index.php/apps/calendar/export.php?calid=4'];

var nock = require('nock');
// var assert = require('chai').assert;
var expect = require('chai').expect;
var should = require('chai').should()
var Q = require('q');


var urls = [
'http://calendar.com/cal01',
'http://calendar.com/cal02'
];

var mocks = [
'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:ownCloud Calendar 0.6.4\nX-WR-CALNAME:Other\n'
+'BEGIN:VEVENT\nCREATED;VALUE=DATE-TIME:20150217T191340Z\nUID:a5f7e22333\nLAST-MODIFIED;VALUE=DATE-TIME:20150217T191340Z\nDTSTAMP;VALUE=DATE-TIME:20150217T191340Z\nSUMMARY:Asdf\nDTSTART;VALUE=DATE:20150219\nDTEND;VALUE=DATE:20150220\nEND:VEVENT\n'
+'END:VCALENDAR'
,
'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:ownCloud Calendar 0.6.4\nX-WR-CALNAME:Persönlich'
+'BEGIN:VEVENT\nCREATED;VALUE=DATE-TIME:20150217T165618Z\nUID:bb3bcd4c00\nLAST-MODIFIED;VALUE=DATE-TIME:20150217T165618Z\nDTSTAMP;VALUE=DATE-TIME:20150217T165618Z\nSUMMARY:Test\nDTSTART;VALUE=DATE:20150218\nDTEND;VALUE=DATE:20150219\nEND:VEVENT\n'
+'BEGIN:VEVENT\nCREATED;VALUE=DATE-TIME:20150217T191330Z\nUID:907b4cbf89\nLAST-MODIFIED;VALUE=DATE-TIME:20150217T191330Z\nDTSTAMP;VALUE=DATE-TIME:20150217T191330Z\nSUMMARY:Wasdf\nDTSTART;VALUE=DATE:20150212\nDTEND;VALUE=DATE:20150213\nEND:VEVENT\n'
+'END:VCALENDAR'
];

var mockEvents = [
'BEGIN:VEVENT\nCREATED;VALUE=DATE-TIME:20150217T191340Z\nUID:a5f7e22333\nLAST-MODIFIED;VALUE=DATE-TIME:20150217T191340Z\n'
+'DTSTAMP;VALUE=DATE-TIME:20150217T191340Z\nSUMMARY:Asdf\nDTSTART;VALUE=DATE:20150219\nDTEND;VALUE=DATE:20150220\nEND:VEVENT'

,

'BEGIN:VEVENT\nCREATED;VALUE=DATE-TIME:20150217T165618Z\nUID:bb3bcd4c00\nLAST-MODIFIED;VALUE=DATE-TIME:20150217T165618Z\n'
+'DTSTAMP;VALUE=DATE-TIME:20150217T165618Z\nSUMMARY:Test\nDTSTART;VALUE=DATE:20150218\nDTEND;VALUE=DATE:20150219\nEND:VEVENT\n'
+'BEGIN:VEVENT\nCREATED;VALUE=DATE-TIME:20150217T191330Z\nUID:907b4cbf89\nLAST-MODIFIED;VALUE=DATE-TIME:20150217T191330Z\n'
+'DTSTAMP;VALUE=DATE-TIME:20150217T191330Z\nSUMMARY:Wasdf\nDTSTART;VALUE=DATE:20150212\nDTEND;VALUE=DATE:20150213\nEND:VEVENT'

];

var expectedCalendar = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:ownCloud Calendar 0.6.4\nX-WR-CALNAME:Default\n'
+'BEGIN:VEVENT\nCREATED;VALUE=DATE-TIME:20150217T191340Z\nUID:a5f7e22333\nLAST-MODIFIED;VALUE=DATE-TIME:20150217T191340Z\n'
+'DTSTAMP;VALUE=DATE-TIME:20150217T191340Z\nSUMMARY:Asdf\nDTSTART;VALUE=DATE:20150219\nDTEND;VALUE=DATE:20150220\nEND:VEVENT\n'
+'BEGIN:VEVENT\nCREATED;VALUE=DATE-TIME:20150217T165618Z\nUID:bb3bcd4c00\nLAST-MODIFIED;VALUE=DATE-TIME:20150217T165618Z\n'
+'DTSTAMP;VALUE=DATE-TIME:20150217T165618Z\nSUMMARY:Test\nDTSTART;VALUE=DATE:20150218\nDTEND;VALUE=DATE:20150219\nEND:VEVENT\n'
+'BEGIN:VEVENT\nCREATED;VALUE=DATE-TIME:20150217T191330Z\nUID:907b4cbf89\nLAST-MODIFIED;VALUE=DATE-TIME:20150217T191330Z\n'
+'DTSTAMP;VALUE=DATE-TIME:20150217T191330Z\nSUMMARY:Wasdf\nDTSTART;VALUE=DATE:20150212\nDTEND;VALUE=DATE:20150213\nEND:VEVENT\n'
+'END:VCALENDAR';




describe('calComposer', function(){
  describe('Request', function(){

    var request = require('../src/request');

    beforeEach(function(){
      nock('http://calendar.com')
      .get('/cal01')
      .reply(200,mocks[0])
      .get('/cal02')
      .reply(200,mocks[1])
    });

    it('should return calendar for url', function(done){

      // request one Url
      request.one(urls[0])
        .then(function(calendar){
          calendar.should.equal(mocks[0]);
          done();
        });

    });

    it('should return calendars for array of Urls',function(done){

      //request all urls
      var promises = request.all(urls);
      Q.all(promises).then(function(calendars){
        for(var i = 0 ; i< calendars.length; i++){
          calendars[i].should.equal(mocks[i]);
        }
        done();
      })

    })

  });

  describe('Transformator',function(){

    var transformator = require('../src/transformator');

    it('should extract events from calendar',function(done){
        var promise = Q(mocks[0]);
        transformator.extractOne(promise).then(function(events){
          events.should.equal(mockEvents[0]);
          done();
        })
    })

    it('should extract events from promise Array',function(done){
      var promises = [Q(mocks[0]),Q(mocks[1])];
      Q.all(transformator.extractAll(promises)).then(function(eventsArr){
        for(var i = 0; i < eventsArr.length; i++){
          eventsArr[i].should.equal(mockEvents[i]);
        }
        done();
      })
    })

    it('should compose events to a new Calendar',function(){
      var transformed = [Q(mockEvents[0]),Q(mockEvents[1])];
      transformator.compose(transformed).then(function(calendar){
        calendar.shoudl.equal(expectedCalendar);
      })

    })

  });

  describe('Application',function(){

    beforeEach(function(){
      nock('http://calendar.com')
      .get('/cal01')
      .reply(200,mocks[0])
      .get('/cal02')
      .reply(200,mocks[1])
    })

    it('should transform list of calDav url to new Calendar',function(done){
      var calComposer = require('../');

      calComposer.composeFromUrls(urls).then(function(calendar){
        calendar.should.equal(expectedCalendar);
        done();
      })
    })
  })




});
