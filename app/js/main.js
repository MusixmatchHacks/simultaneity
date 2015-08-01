// Require the styles
require('../sass/main_style.sass');

// Include the required modules

// CONSTANTS
const INDEX_LONGITUDE= 5;
const INDEX_LATTITUDE = 6;
const INDEX_APP_REQUEST_ID = 10;

// The width and height properties of the map
let osColorManager = require('./osColorManager');
osColorManager.logUniqueOSNames();

let width = window.innerWidth,
	height = window.innerHeight;

let labels = d3.select('#labels')
	.attr('width', width)
	.attr('height', height);

let svg = d3.select('#world')
	.attr('width', width)
	.attr('height', height);

let projection = d3.geo.equirectangular()
	.scale(width / 5.7)
	.translate([width / 2, height / 2])
	.precision(.1);

let path = d3.geo.path()
	.projection(projection);


d3.json("./vendors/world.json", function(error, world) {
	if (error) throw error;

	svg.insert("path", ".graticule")
		.datum(topojson.feature(world, world.objects.land))
		.attr("class", "land")
		.attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");

function getCartesianCoords(longitude, lattitude) {
	return projection([longitude, lattitude]);
}

function randomRotateDeg(bottom, top) {
	return Math.floor(Math.random() * (1 + top - bottom)) + bottom;
}
// Add the data points on the map

// Data points rendered using svg images 
let labelText = "label";
let labelIndex = 0;

function addDataPointsCircles(data) {
	let newLayerName = labelText + labelIndex;
	$(document.body).prepend(
		"<svg class = 'labels' id = '" + newLayerName + "' width = '" + width +"px' height ='" + height + "px' ></svg>"
	);
	d3.select('#' + newLayerName).selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.classed('location', true)
		.attr('r', 1)
		.style('opacity', 0)
		.each(function(d) {
			// Using destructuring arguments right over here 
			let [x, y] = getCartesianCoords(d[INDEX_LONGITUDE], d[INDEX_LATTITUDE]);
			d3.select(this)
				.attr('cx', x)
				.attr('cy', y)
				.style('fill', osColorManager.getOSColor(d[INDEX_APP_REQUEST_ID]));
		})
		.transition().duration(1000).delay(100)
		.style('opacity', 0.6);

	labelIndex++;
}


let dataUrl = "http://ec2-54-147-191-254.compute-1.amazonaws.com/view_relayer_dummy/get_views";

function getJSON(url) {
	return $.getJSON(url);
}

function getDatPointPromise(dataPointsUrl) {
	getJSON(dataPointsUrl).then(function(response) {
		addDataPointsCircles(response);
	});
}

// set some amount of data or whatever right over here
setInterval(()=>{
	getDatPointPromise(dataUrl);
}, 2000);
