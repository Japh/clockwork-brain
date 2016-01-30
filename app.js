var Q = require('q')
  , Spark = require('spark')
  , weather = require('./weather')
  , config = require('./config');

var state = {};

function setProcess (state) {
  var deferred = Q.defer();
  deferred.resolve(state);
  return deferred.promise;
}

var proceed = setProcess(state)
  .then(function(state) {
    var deferred = Q.defer();

    Spark.login({
      accessToken: config.particle.auth_token
    }, function(error, body) {
      if (error) {
        deferred.reject(error);
      } else {
        state.spark_login = body;
        deferred.resolve(state);
      }
    });

    return deferred.promise;
  })
  .then(function(state) {
    var deferred = Q.defer();

    Spark.getDevice(config.particle.device_id, function(error, device) {
      if (error) {
        deferred.reject(error);
      } else {
        state.device = device;

        if (device.connected) {
          deferred.resolve(state);
        } else {
          deferred.reject("Device '" + device.name + "' not connected.");
        }
      }
    });

    return deferred.promise;
  })
  .then(weather.getFromBom)
  .then(function(state) {
    var deferred = Q.defer();

    state.device.callFunction('currentTemp', state.temperature, function(error, data) {
      if (error) {
        deferred.reject(error);
      } else {
        console.log(data);
        deferred.resolve(state);
      }
    });

    return deferred.promise;
  })
  .then(function(state) {
    console.log( state.temperature );
  })
  .catch(function(err) {
		console.log(err);
	});
