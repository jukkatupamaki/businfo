var request = require('request');
var Q = require('Q');
var _ = require('lodash');

module.exports = {
	fetch: function(requestedBusLines) {
		// Create a deferred object that we resolve later with correct data
		var deferred = Q.defer();

		request.get(
			"http://data.itsfactory.fi/siriaccess/vm/json", 
			function handleJSONResponse(error, response, body) {
				if(parseInt(response.statusCode, 10) !== 200 || error) {
					deferred.reject(error);
				} else {
					// Parse the JSON string in 'body' to a JavaScript object
					var jsonData = JSON.parse(body);

					// The JSON response is very deep. 
					var vehicleActivity = jsonData.Siri.ServiceDelivery.VehicleMonitoringDelivery[0].VehicleActivity;

					// Re-format the objects to be a bit more useful
					var activeBusLines = {};

					// The JSON is a bit badly formed for our use so lets re-format it.
					vehicleActivity.forEach(function(data) {
						// Take the most interesting object only to shorten references
						data = data.MonitoredVehicleJourney;

						// Lines can have multiple buses, or vehicles, at the same time.
						// Create an array for the bus line if it does not exist yet
						if(!activeBusLines[data.LineRef.value]) {
							activeBusLines[data.LineRef.value] = [];
						}

						var vehicleData = {
							lineRef: data.LineRef.value,
							from: data.OriginName.value,
							to: data.DestinationName.value,
							location: {
								latitude: data.VehicleLocation.Longitude,
								longitude: data.VehicleLocation.Latitude,
								bearing: data.Bearing
							},
							vehicleRef: data.VehicleRef.value
						};

						// Push the vehicle data to the correct array
						activeBusLines[data.LineRef.value].push(vehicleData);
					});

					// Pick lines that we are interested in
					deferred.resolve(_.pick(activeBusLines, requestedBusLines));
				}
			}
		);

		// By returning the promise object from the deferred,
		// we can use then() in main.js and wait for the Deferred to resolve.
		return deferred.promise;
	}
};
