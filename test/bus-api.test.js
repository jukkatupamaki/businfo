var mocha = require('mocha');
var should = require('chai').should();

describe("Bus API", function() {
	describe("fetch()", function() {
		var busApi = require('../bus-api.js');

		it("should return a bus line with at least one vehicle", function(done) {
			var busLines = [ "1" ];

			busApi.fetch(busLines).then(function(result) {
				result.should.be.an("object");
				result.should.have.property(busLines[0]);

				/* Find a bus / a vehicle object from the array and validate its contents. */

				// Test that the property contains an array that has a length of at least 1.
				result[busLines[0]].should.be.an("array").and.have.length.above(1);

				var vehicle = result[busLines[0]][0];

				// Test that the bus / vehicle object has the correct properties.
				vehicle.should.have.property("lineRef").that.is.a("string");
				vehicle.should.have.property("from").that.is.a("string");
				vehicle.should.have.property("to").that.is.a("string");
				vehicle.should.have.property("vehicleRef").that.is.a("string");
				vehicle.should.have.property("location").that.is.an("object")
					.and.has.keys("latitude", "longitude", "bearing");
				
				done(); // done() must be called as this is an asynchronous test case.
			}).fail(function(error) {
				// Calling done(error) here to make the test fail instead of timeouting.
				done(error); 
			});
		});

	});
});