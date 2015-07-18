(function() {
	'use strict';


	// The width and height properties of the map
	var width = window.innerWidth,
		height = window.innerHeight;

	var labels = d3.select('#labels')
		.attr('width', width)
		.attr('height', height);

	var svg = d3.select('#world')
		.attr('width', width)
		.attr('height', height);

	var projection = d3.geo.equirectangular()
		.scale(250)
		.translate([width / 2, height / 2]);
		// .precision(.1);

	// let us locate a few points on the map
	var testerPoint = projection([73, 19]);

	d3.select('#location0')
		.attr('cx', testerPoint[0])
		.attr('cy', testerPoint[1]);

	var path = d3.geo.path()
		.projection(projection);

	var graticule = d3.geo.graticule();

	svg.append("path")
		.datum(graticule)
		.attr("class", "graticule")
		.attr("d", path);

	d3.json("../scripts/world.json", function(error, world) {
		if (error) throw error;

		svg.insert("path", ".graticule")
			.datum(topojson.feature(world, world.objects.land))
			.attr("class", "land")
			.attr("d", path);

		svg.insert("path", ".graticule")
			.datum(topojson.mesh(world, world.objects.countries, function(a, b) {
				return a !== b;
			}))
			.attr("class", "boundary")
			.attr("d", path);
	});

	d3.select(self.frameElement).style("height", height + "px");


})();