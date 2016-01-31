var Q = require('q')
  , particle = require('./particle')
  , config = require('./config');

var state = {};

var proceed = setProcess(state)
  .then(particle.login)
  .then(particle.getDevice)
  .then(function(state) {
    var deferred = Q.defer();

    state.message = process.argv[2];

    console.log('Setting message to: ' + state.message);

    deferred.resolve(state);

    return deferred.promise;
  })
  .then(particle.setMessage)
  .then(function(state) {
    console.log('Application process complete.');
    console.log( state.message );
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
