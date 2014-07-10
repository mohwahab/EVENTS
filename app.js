/**
 * Module dependencies.
 */
var log = require('loglevel');
var express = require('express');

var app = express();
app.use(express.bodyParser());

var server = require('http').createServer(app);
var mongoose = require ("mongoose");
var Event = require('./model/event.js');
var common = require('./util/common');

var config = common.config();
log.setLevel(config.log_level);

var dbUrl = config.db_url;
mongoose.connect(dbUrl); 

// all environments
app.set('port', process.env.PORT || 3000);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.post('/add', function(req, res) {
	log.info("[ "+req.method+" /add/"+JSON.stringify(req.body)+" ]");
	Event.createEvent(req.body, function(error, newEvent){    		
		if(error){    			
			log.error("ADD EVENT ERROR: "+error);
			res.json(500, error);
		}else{   
			//res.send(200);
			res.json({id:newEvent.id}); 			
		}
	});
});

app.get('/events', function(req, res) {
	log.info("[ "+req.method+" /events ]");
	Event.getEvents(function(error, events){
		if(error) {
	    	 log.error("ERROR: "+JSON.stringify(result.error));
	    	 res.json(500, error);
	     }else{
	    	 res.json(events);
	     }
	});
});



exports.start = function(cb) {
	server.listen(app.get('port'), function(){
		log.debug('Server listening on port ' + app.get('port'));
		cb && cb()
	});
}

exports.close = function(cb) {
  if (server) server.close(cb)
}

// when app.js is launched directly
if (module.id === require.main.id) {
  exports.start()
}