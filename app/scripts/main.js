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
		.scale(width / 5.7)
		.translate([width / 2, height / 2])
		.precision(.1);

	var path = d3.geo.path()
		.projection(projection);


	d3.json("../scripts/world.json", function(error, world) {
		if (error) throw error;

		svg.insert("path", ".graticule")
			.datum(topojson.feature(world, world.objects.land))
			.attr("class", "land")
			.attr("d", path);
	});

	d3.select(self.frameElement).style("height", height + "px");

	function getCartFromDeg(longitude, lattitude) {
		var degPos = [];
		degPos.push(longitude);
		degPos.push(lattitude);
		return projection(degPos);
	}

	function randomRotateDeg(bottom, top) {
		return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
	}
	// Add the data points on the map

	// Data points rendered using svg images 
	var labelText = "label";
	var labelIndex = 0;
	function addDataPointsTails(data) {
		var newLayerName = labelText + labelIndex;
		$(document.body).prepend(
			"<svg class = 'labels' id = '" + newLayerName + "' width = '" + width +"px' height ='" + height + "px' ></svg>"
		);

		d3.select('#' + newLayerName).selectAll('image')
			.data(data)
			.enter()
			.append('image')
			.attr('xlink:href', '../images/dot.svg')
			.attr('width', '5px')
			.attr('height', '5px')
			.attr('opacity', 0)
			.transition()
			.duration(300).delay(100)
			.attr('opacity', 1)
			.each(function(d) {
				var cartPos = getCartFromDeg(d[5], d[6]); // Cartesian position
				d3.select(this)
					.attr('x', cartPos[0] - 2.5)
					.attr('y', cartPos[1] - 2.5)
					.attr('transform', function(d) {
						return 'rotate(' + randomRotateDeg(-180, 180) + ' ' + (cartPos[0] + 2.5) + ' ' + (cartPos[1] + 2.5) + ')';
					});
			});
	}


	function addDataPointsCircles(data) {
		var newLayerName = labelText + labelIndex;
		$(document.body).prepend(
			"<svg class = 'labels' id = '" + newLayerName + "' width = '" + width +"px' height ='" + height + "px' ></svg>"
		);
		d3.select('#' + newLayerName).selectAll('circle')
			.data(data)
			.enter()
			.append('circle')
			.classed('location', true)
			.attr('r', '1px')
			.style('opacity', 0)
			.each(function(d) {
				var cartPos = getCartFromDeg(d[5], d[6]); // Cartesian position
				d3.select(this).attr('cx', cartPos[0]);
				d3.select(this).attr('cy', cartPos[1]);
			})
			.transition().duration(1000).delay(100)
			.style('opacity', 1);

		labelIndex++;
	}


	var dataUrl = "http://ec2-54-147-191-254.compute-1.amazonaws.com/view_relayer_dummy/get_views";

	function getJSON(url) {
		return $.getJSON(url);
	}

	function getDatPointPromise(dataPointsUrl) {
		getJSON(dataPointsUrl).then(function(response) {
			addDataPointsCircles(response);
		});
	}

	// set some amount of data or whatever right over here
	setInterval(function() {
		getDatPointPromise(dataUrl);
	}, 2000);

})();