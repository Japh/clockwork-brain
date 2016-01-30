var Q = require('q')
  , Spark = require('spark')
  , CronJob = require('cron').CronJob
  , config = require('./config');

exports.login = function(state) {
  var deferred = Q.defer();

  console.log('Do Particle login...');

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

  console.log('Do Particle login complete.');

  return deferred.promise;
};

exports.getDevice = function(state) {
  var deferred = Q.defer();

  console.log('Get Particle device...');

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

  console.log('Get Particle device complete.');

  return deferred.promise;
};

exports.setFunction = function(state) {
  var deferred = Q.defer();

  console.log('Set Particle function...');

  state.device.callFunction('currentTemp', state.temperature, function(error, data) {
    if (error) {
      deferred.reject(error);
    } else {
      deferred.resolve(state);
    }
  });

  console.log('Set Particle function complete.');

  return deferred.promise;
};
