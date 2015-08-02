// Require the styles
require('../sass/main_style.sass');

// Include the required modules

// CONSTANTS
/**
 * Index for the longitude data from the retreived array from endpoint
 * @type {Number}
 */	
const INDEX_LONGITUDE= 5;
/**
 * index for the lattitude data from the retreived array from endpoint
 * @type {Number}
 */
const INDEX_LATTITUDE = 6;
/**
 * Index for the app_request_id data from the retreived array from endpoint
 * @type {Number}
 */
const INDEX_APP_REQUEST_ID = 10;

let WorldMap = require('./WorldMap.js');
let osColorManager = require('./osColorManager');

WorldMap.init();
let projection = WorldMap.getProjection();
let [width, height] = WorldMap.getDimensions();

// Calls the API for data every two seconds and adds the data points to the map 
setInterval(()=>{
	getDatPointPromise(dataUrl);
}, 2000);

/**
 * Given the lattitude and logitude returns an array holding lattitude and logitude values converted to cartesian
 * coordinates for placing them on the map.
 * @param  {number} longitude Longitude e.g. (15.34)
 * @param  {number} lattitude Lattitude e.g. (33)
 * @return {array}           Array with two elements each corresponding to Cartesian values of longitude and lattitude
 */
function getCartesianCoords(longitude, lattitude) {
	return projection([longitude, lattitude]);
}


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
		.attr('r', 0.8)
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


/**
 * Url that is pinged after every few seconds to get the new set of data.
 * @type {String}
 */
let dataUrl = "http://ec2-54-147-191-254.compute-1.amazonaws.com/view_relayer_dummy/get_views";


/**
 * Gets and adds data points to the world map from the passed in dataPointsUrl
 * @method
 * @param  {string} Endpoint from where data is to be retrieved 
 * @return {nothing}
 */
function getDatPointPromise(dataPointsUrl) {
	$.getJSON(dataPointsUrl).then(function(response) {
		addDataPointsCircles(response);
	});
}


