/**
 * Test file
 */

var common = require('/home/saasbook/Aptana\ Studio\ 3\ Workspace/EVENTS/util/common');
var config = common.config();
var request = require('superagent');
var mongoose = require("mongoose");  
var Event = require("/home/saasbook/Aptana\ Studio\ 3\ Workspace/EVENTS/model/event.js"); 
var async = require("async");
var svrUrl = config.svr_url;

var options ={
  transports: ['websocket'],
  'force new connection': true
}; 


console.log("\n RUNNING TESTS ON "+config.env+" ENV \n");
console.log("\n RUNNING TESTS ON URL: "+svrUrl+"\n");

if(config.env === 'development'){
	var app = require('/home/saasbook/Aptana\ Studio\ 3\ Workspace/EVENTS/app');

	before(function(done) {
	  app.start(done);
	})

	after(function(done) {
	  app.close(done);
	})
}else{
	var dbUrl = config.db_url;
	console.log("\n CONNECTING TO DB@("+dbUrl+")\n");
	mongoose.connect(dbUrl);
}

afterEach(function(done){
	this.timeout(600000);
    //Clear Database
    Event.model.remove({}, function() {
	    console.log("\nDATABASE CLEARED");
	    done();    
   });  
});		

describe('Events', function(){
    
    it("Should be able to add new event", function(done){
        //this.timeout(100000);
        var eventObj={
                        name:"Ramadan Karim",
                        description:"Go Charity",
                        startdate: new Date('Jun 29, 2014'),
                        enddate: new Date('Jul 29, 2014'),
                        country:"Egypt",
                        type: "Charity",
                        time:[{starttime:"3:15",endtime:"19:10"}],
                        lat:"31.099865",
                        lng:"30.021395"
                   }
         console.log("1:::: "+eventObj.time[0].starttime);          
         console.log("2:::: "+eventObj.time[0].endtime);          
        //eventObj="1"
        request
            .post(svrUrl+'/add')
            .send(eventObj)
            .end(function(res){
                res.statusCode.should.equal(200);
                Event.getEvents(function(error, events){
                  console.log("ERROR: "+JSON.stringify(error));
                  console.log("EVENTS: "+JSON.stringify(events));
                	JSON.stringify(events).should.eql(JSON.stringify([
                                      {
                                        "name": eventObj.name,
                                        "description": eventObj.description,
                                        "lat": eventObj.lat,
                                        "lng": eventObj.lng,
                                        "startdate": eventObj.startdate,
                                        "enddate": eventObj.enddate,
                                        "country": eventObj.country,
                                       "type": eventObj.type,                                      
                                       "time": [
                                         {
                                           "starttime": eventObj.time[0].starttime,
                                           "endtime": eventObj.time[0].endtime                               
                                         }
                                       ]
                                     }
                                  ])
                               );
                	done();
                });
              
            });
    });       
        
});