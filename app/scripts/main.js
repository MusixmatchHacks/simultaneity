(function() {
	'use strict';

	// let us see if we have the data here 
	var MAX_DATA_LENGTH = 10000;

	var truncatedData = sample_data.slice(0, MAX_DATA_LENGTH);

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
		.scale(width/5.7)
		.translate([width / 2, height / 2]);
		// .precision(.1);

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

	function getCartFromDeg(longitude, lattitude) {
		var degPos = [];
		degPos.push(longitude);
		degPos.push(lattitude);
		console.log(degPos);
		return projection(degPos);
	}

	// Add the data points on the map
	labels.selectAll('circle')
		.data(truncatedData)
		.enter()
		.append('circle')
		.classed('location', true)
		.attr('r', '1px')
		.each(function(d) {
			var cartPos = getCartFromDeg(d.long, d.lat); // Cartesian position
			d3.select(this).attr('cx', cartPos[0]);
			d3.select(this).attr('cy', cartPos[1]);
		});



})();