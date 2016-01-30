var Q = require('q')
  , Spark = require('spark')
  , brain = require('./brain')
  , particle = require('./particle')
//  , weather = require('./weather')
  , config = require('./config');

var state = {};

var proceed = setProcess(state)
  .then(particle.login)
  .then(brain.doSchedule)
//  .then(particle.getDevice)
//  .then(weather.getFromBom)
//  .then(particle.setFunction)
  .then(function(state) {
    console.log('Application process complete.');
    console.log( state.temperature );
  })
  .catch(function(err) {
    console.log('Application process error:');
		console.log(err);
	});

function setProcess (state) {
  var deferred = Q.defer();
  console.log('Beginning application process...');
  deferred.resolve(state);
  return deferred.promise;
}
