/**
 * Event model
 */
var log = require('loglevel');

var Event = function(){  
	var mongoose = require('mongoose');
	var Schema = mongoose.Schema;
	console.log('    mongoose version: %s', mongoose.version);
	var EventSchema = new Schema({
	  name:  String,
	  description:  String,
	  startdate: Date,
	  enddate: Date,
	  country: String,
	  time: [{starttime:String, endtime:String}],
	  type:  String,
	  lat:  String,
	  lng:  String
    });

//	WORKAROUND FOR EMPTY LOCATION OBJECTS
//	EventSchema.pre('save', function (next) {
//		  if (this.isNew && Array.isArray(this.loc.coordinates) && 0 === this.loc.coordinates.length) {
//		    this.loc.coordinates = undefined;
//		  }
//		  next();
//	});
	
	//EventSchema.index({ loc: '2dsphere' });
	var _model = mongoose.model('Event', EventSchema);
		
// CLOSE CONNECTION	
//	function done (err) {
//	    if (err) console.error(err.stack);
//	      mongoose.connection.db.dropDatabase(function () {
//	              mongoose.connection.close();
//	                });
//	}
	
	var _createEvent = function(event, callback){
		log.debug("[name]: "+event.name+" [description]: "+event.description+" [lng]: "+event.lng+" [lat]: "+event.lat+" [startdate]: "+event.startdate+" [enddate]: "+event.enddate+" [country]: "+event.country+" [type]: "+event.type+" [time]: "+event.time);
		_model.create({ name: event.name, description: event.description, lat: event.lat, lng: event.lng, startdate: event.startdate, enddate: event.enddate, country: event.country, type: event.type, time: event.time},function(error,newEvent){
				if(error) {
					log.error("ERROR CREATE EVENT: "+error);
					callback({ error : error});
		       } else {
		       		callback();
		       }
		        
			});
	};
	
	var _getEvents = function(callback){
		//log.debug("[startdate]: "+startdate+" [enddate]: "+enddate);
		//_model.find({'Date.now': {"$gte": "startdate", "$lte": "enddate"}},function(error,events){
		_model.find( { $or: [ { startdate: {"$lte": new Date()} }, { enddate: {"$gte": new Date()} } ] }, {_id:0, __v:0, 'time._id':0} ,function(error,events){	
				    		 callback(error, events);
		});
	};   
	   
	   
	return {
		createEvent: _createEvent,
	    schema: EventSchema,
	    getEvents: _getEvents,
	    model: _model
	  }
	
}();

module.exports = Event;