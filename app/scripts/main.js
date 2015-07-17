(function() {

	'use strict';

	console.log("this is happening");

	// The width and height properties of the map
	var width = window.innerWidth,
		height = window.innerHeight;

	var svg = d3.select('#world')
		.attr('width', width)
		.attr('height', height);

	var projection = d3.geo.stereographic()
		.clipAngle(160)
		.scale(300)
		.rotate([-35, -15]);

	window.onresize = function() {
		width = window.innerWidth;
		height = window.innerHeight;
		svg.attr('width', width).attr('height', height);
	};

	var path = d3.geo.path()
		.projection(projection);

	var lambda = d3.scale.linear()
		.domain([0, width])
		.range([-180, 180]);

	var psi = d3.scale.linear()
		.domain([0, height])
		.range([90, -90]);


	// svg.on("mousemove", function() {
	// 	var p = d3.mouse(this);
	// 	projection.rotate([lambda(p[0]), psi(p[1])]);
	// 	svg.selectAll("path").attr("d", path);
	// });


	d3.json('./scripts/world.json', function(error, world) {
		if (error) {
			console.log("There was an error");
			throw error;
		}

		svg.append('path')
			.datum(topojson.feature(world, world.objects.land))
			.attr('d', path);
	});


})();