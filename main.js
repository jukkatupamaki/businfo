var request = require('request');

request(
	"http://data.itsfactory.fi/siriaccess/vm/rest", 
	function handleJSONResponse(error, response, body) {
		console.log(error, response, body);
	}
);
