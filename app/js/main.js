// Bebel automatically wraps the file around a self invoking anonymous function so no need to worry on that front 
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
const INDEX_ARTIST_NAME = 4;

/**
 * Number of miliseconds after which request is made to the endpoint for new data.
 * @type {Number}
 */
const REQUEST_INTERVAL = 1500;

const NOT_VISIBLE = '0';

// jQuery Objects 
let $topSongContainer = $('.top_song_container');
let $osDotsContainer = $('#os_container');

let osColorManager = require('./osColorManager');

/**
 * Url that is pinged after every few seconds to get the new set of data.
 * @type {String}
 */
let dataUrl = "http://ec2-54-147-191-254.compute-1.amazonaws.com/view_relayer_dummy/get_views";

let WorldMap = require('./WorldMap.js');
WorldMap.init();
let projection = WorldMap.getProjection();
let [width, height] = WorldMap.getDimensions();


// Calls the API for data every two seconds and adds the data points to the map 
setInterval(()=>{
	getDatPointPromise(dataUrl);
}, REQUEST_INTERVAL);


// let us add the click listeners to the toggle buttons 
$('.toggle_buttons_container').children().each(function() {
	$(this).on('click', function() {
		let osToToggle = $(this).attr('data-os');
		toggleOSVisibility(osToToggle);
	});
});

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
j * @method showMostSearchedSong
 */
function showMostSearchedSong(data) {
	let [randomX, randomY] = getRandomLocation(data);
	$topSongContainer.css({'top' : randomY, 'left' : randomX});
	let [mostSearchedSong, mostSearchedSongArtist] = findMostSearchedSong(data);
	$topSongContainer.html(mostSearchedSong.toUpperCase() + "<br/> - " + mostSearchedSongArtist);
}

/**
 * Given data retreived from the ened point returns a random location from that data.
 * @method getRandomLocation
 * @param  {array} data  Raw Data captured from the endpoint
 * @return {array}      [x, y]
 */
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
	let mostSearchedSongArtist = "";
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
			mostSearchedSongArtist = currentData[INDEX_ARTIST_NAME];
		}
	}

	return [mostSearchedSong, mostSearchedSongArtist];
}

/**
 * Given name of the operating system/service checks if it is supposed to be hidden on the map or not 
 * @method toHide
 * @param  {string} OSName Name of the operating system/service
 * @return {boolean}        True if the OS / Service is supposed to be hidden false otherwise
 */
function toHide(OSName) {
	return OSsToHide.indexOf(OSName) > -1 ;
}

function getOsClass(osName) {
	return '.os_' + osName;
}

/**
 * Given the name of the service/os e.g android/windows/other toggles the visibility of related dots on the map
 * @param  {string} osName Name of the OS/Service whose dot visibility is to be toggled
 * @method  toggleOSVisibility
 */
function toggleOSVisibility(osName) {
	let osContainer = d3.select(getOsClass(osName));
	let currentVisibility = osContainer.style('opacity');

	if(currentVisibility === NOT_VISIBLE) {  
		osContainer.style('opacity', 1);
	} else {
		osContainer.style('opacity', 0);
	}
}

/**
 * Given the data for an interval from the endpoint, adds data points on the map corresponding to the data
 * @method addDataPointsCircles
 * @param {array} data Data retreived from the endpoint for an interval
 */
var addDataPointsCircles = function(data) {
	// let us simply loop through the raw data just like that 
	for(let currentData of data) {
		let osName = osColorManager.getOSName(currentData[INDEX_APP_REQUEST_ID]);
		let osClassName = getOsClass(osName);

		let [x, y] = getCartesianCoords(currentData[INDEX_LONGITUDE], currentData[INDEX_LATTITUDE]);

		d3.select(osClassName)
			.append('circle')
			.attr('r', 0.3)
			.style('opacity', 0)
			.attr('cx', x).attr('cy', y)
			.style('fill', osColorManager.getOSColor(currentData[INDEX_APP_REQUEST_ID]))
			.transition().duration(1000).delay(500)
			.attr('r', 1)
			.style('opacity', 0.6);
	}
};