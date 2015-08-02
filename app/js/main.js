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
const INDEX_SONG_NAME = 3;

/**
 * Number of miliseconds after which request is made to the endpoint for new data.
 * @type {Number}
 */
const REQUEST_INTERVAL = 1500;

// jQuery Objects 
let $topSongContainer = $('.top_song_container');

let osColorManager = require('./osColorManager');

let WorldMap = require('./WorldMap.js');
WorldMap.init();
let projection = WorldMap.getProjection();
let [width, height] = WorldMap.getDimensions();

// Calls the API for data every two seconds and adds the data points to the map 
setInterval(()=>{
	getDatPointPromise(dataUrl);
}, REQUEST_INTERVAL);

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
		showMostSearchedSong(response);
	});
}


/**
 * Finds the most searched song for a particular interval and shows it in the viewport inside a div
 * @param  {array} data Data containing all the required information for a particular interval 
 * @method showMostSearchedSong
 */
function showMostSearchedSong(data) {
	let [randomX, randomY] = getRandomLocation(data);
	$topSongContainer.css({'top' : randomY, 'left' : randomX});
	$topSongContainer.html(findMostSearchedSong(data).toUpperCase());
}

function getRandomLocation (data){
	let randomData = data[Math.floor(data.length * Math.random())];
	return getCartesianCoords(randomData[INDEX_LONGITUDE], randomData[INDEX_LATTITUDE]);
}

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

/**
 * Returns the name of the song that has been searched most number of times given the data for a particular interval
 * @param  {array} data Data containing all the required information for an interval
 * @method  findMostSearchedSong
 * @return {string} Name of the most searched song
 */
function findMostSearchedSong(data) {

	let mostSearchedSong = ""
	let mostSearchedSongCount = 0;

	let songSearchCount= {};
	// Loop through the data and find the name of the songSearchCountand then increment their count 
	for( let currentData of data ) {
		let songName = currentData[INDEX_SONG_NAME];
		if(songSearchCount.hasOwnProperty(songName)) {
			songSearchCount[songName]++;
		} else { 
			songSearchCount[songName] = 1;
		}

		if(songSearchCount[songName] >= mostSearchedSongCount) {
			mostSearchedSong = songName;
			mostSearchedSongCount = songSearchCount[songName];
		}
	}

	return mostSearchedSong;
}


// Data points rendered using svg images 
let labelText = "label";
let labelIndex = 0;

function addDataPointsCircles(data) {
	let newLayerName = labelText + labelIndex;
	// fucking webpack won't support templated strings mother fuck
 	// let appendix = `<svg class = 'labels' id = '${newLayerName}' width = '${width}px' height = '${height}px' ></svg>`;
	$(document.body).prepend(
		"<svg class = 'labels' id = '" + newLayerName + "' width = '" + width +"px' height ='" + height + "px' ></svg>"
	);
	d3.select('#' + newLayerName).selectAll('circle')
		.data(data)
		.enter()
		.append('circle')
		.classed('location', true)
		.attr('r', 0.3)
		.style('opacity', 0)
		.each(function(d) {
			// Using destructuring arguments right over here 
			let [x, y] = getCartesianCoords(d[INDEX_LONGITUDE], d[INDEX_LATTITUDE]);
			d3.select(this)
				.attr('cx', x)
				.attr('cy', y)
				.style('fill', osColorManager.getOSColor(d[INDEX_APP_REQUEST_ID]));
		})
		.transition().duration(1000).delay(300)
		.attr('r', 1)
		.style('opacity', 0.6);

	labelIndex++;
}



