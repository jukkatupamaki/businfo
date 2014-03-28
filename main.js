var busApi = require('./bus-api.js');

var requestedLines = process.argv.slice(2);
busApi.fetch(requestedLines).then(console.log);
