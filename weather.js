var Q = require('q')
  , bom = require('bom-api')
  , config = require('./config');

exports.getFromBom = function(state) {
  var deferred = Q.defer();

  bom.getBomDataBySiteNumberState(config.bom.site_number, config.bom.state_code, function(error, data) {
    if (error) {
      deferred.reject(error);
    } else {
      var currentTemperature = Math.round( data[0].air_temp );
      currentTemperature = "" + currentTemperature;
      while (currentTemperature.length < 3) {
        currentTemperature = " " + currentTemperature;
      }
      state.temperature = currentTemperature + "C";
      deferred.resolve(state);
    }
  });

  return deferred.promise;
}
