var Q = require('q')
  , CronJob = require('cron').CronJob
  , particle = require('./particle')
  , weather = require('./weather')
  , config = require('./config');

var cronRunCount = 0;
var baseState = {};

var schedule = new CronJob({
  cronTime: '* * * * *',
  onTick: function() {
    cronRunCount++;
    var d = new Date();
    console.log('Cron run #' + cronRunCount + ' at ' + d.toString());
    var proceed = setProcess(baseState)
      .then(particle.getDevice)
      .then(weather.getFromBom)
      .then(particle.setFunction)
      .then(function(baseState) {
        console.log('Brain process complete.');
        console.log( baseState.temperature );
      })
      .catch(function(err) {
        console.log('Brain process error:');
    		console.log(err);
    	});
  },
  start: false,
  timeZone: 'Australia/Hobart',
  runOnInit: true
});

exports.doSchedule = function(state) {
  var deferred = Q.defer();

  console.log('Start cron schedule...');

  baseState = state;

  schedule.start();

  console.log('Start cron schedule complete.');

  return deferred.promise;
};

function setProcess (state) {
  var deferred = Q.defer();
  console.log('Beginning brain process...');
  deferred.resolve(state);
  return deferred.promise;
}
