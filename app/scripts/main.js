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
		.scale(300);

	var lables = d3.select("#labels")
		.attr('width', width)
		.attr('height', height);

	var testerPos = projection([81, 7]);

	d3.select("#location1")
		.attr('cx', testerPos[0])
		.attr('cy', testerPos[1]);


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
// (function(){
// 	'use strict';

// 	var width = window.innerWidth, height = window.innerHeight;
// 	var fadeInTime = 500;
// 	var fadeOutTime = 500;
// 	var updateTime = 3000;

// 	function updateZoom() {
// 	  zoom = width / 4;
// 	}
// 	updateZoom();
// 	var projection = d3.geo.stereographic()
// 	  .scale(zoom / 3)
// 	  .rotate([-35, -15])
// 	  .clipAngle(160)

// 	// This is for the city labels
// 	var svg = d3.select('#labels');
// 	// This is for the world map
// 	var canvas = d3.select('#world');

// 	function updateWindow(){
// 	  width = window.innerWidth;
// 	  height = window.innerHeight;
// 	  svg.attr("width", width).attr("height", height);
// 	  canvas.attr("width", width).attr("height", height);
// 	  projection
// 	    .translate([width / 2, height / 2])
// 	    .clipExtent([[0,0],[width,height]])
// 	  redrawMap();
// 	  updateCityPositions();
// 	  updateZoom();
// 	}
// 	window.onresize = updateWindow;
// 	updateWindow();

// 	var ctx = canvas.node().getContext("2d");
// 	var pathCanvas = d3.geo.path()
// 	  .projection(projection)
// 	  .context(ctx);

// 	var land;
// 	d3.json('../scripts/world.json', function(error, world) {
// 	  land = topojson.feature(world, world.objects.land);
// 	  if(!mobile) {
// 	    rotateTo([-180, 0], 6000, zoom / 2);
// 	  }
// 	  redrawMap();
// 	})

// 	function redrawMap() {
// 	  if(land) {
// 	    ctx.clearRect(0, 0, width, height);
// 	    ctx.fillStyle = 'white';
// 	    ctx.beginPath();
// 	    pathCanvas(land);
// 	    ctx.fill();
// 	  }
// 	}

// 	function fadeOut(cb) {
// 	  d3.select('#overlay').transition()
// 	    .ease('linear')
// 	    .duration(fadeOutTime)
// 	    .style('opacity', 0);
// 	  setTimeout(cb, fadeOutTime);
// 	}

// 	function rotateTo(target, duration, scale, cb) {
// 	  d3.transition()
// 	    .duration(duration)
// 	    .tween("rotate", function() {
// 	      var p = target,
// 	          r = d3.interpolate(projection.rotate(), [-p[0], -p[1]]), // .geo goes over the poles too much
// 	          s = d3.interpolate(projection.scale(), scale);
// 	      return function(t) {
// 	        projection
// 	          .rotate(r(t))
// 	          .scale(s(t));
// 	        redrawMap();
// 	      }
// 	    })
// 	    .each('end', cb)
// 	}

// 	function changeView(locations, cb) {
// 	  var a = locations[0], b = locations[1];
// 	  var target = d3.geo.interpolate(a, b)(0.5); // midpoint
// 	  var distance = d3.geo.distance(a, b); // in radians
// 	  var scale = zoom / (distance + .01); // need a better way to avoid NaNs when distance = 0...
// 	  rotateTo(target, moveTime, scale, cb);
// 	}


// 	var locations;
// 	function updateCityPositions() {
// 	  if(locations) {
// 	    // projected locations
// 	    var screen0 = projection(locations[0]);
// 	    var screen1 = projection(locations[1]);

// 	    // position impact circles
// 	    d3.select('#impact0')
// 	      .attr('cx', screen0[0])
// 	      .attr('cy', screen0[1])
// 	    d3.select('#impact1')
// 	      .attr('cx', screen1[0])
// 	      .attr('cy', screen1[1])

// 	    // position impact points
// 	    d3.select('#point0')
// 	      .attr('cx', screen0[0])
// 	      .attr('cy', screen0[1])
// 	    d3.select('#point1')
// 	      .attr('cx', screen1[0])
// 	      .attr('cy', screen1[1])

// 	    // position city names
// 	    d3.select('#city0')
// 	      .style('left', screen0[0]+'px')
// 	      .style('top', screen0[1]+'px')
// 	    d3.select('#city1')
// 	      .style('left', screen1[0]+'px')
// 	      .style('top', screen1[1]+'px')
// 	  }
// 	}

// 	function formatInfo(str) {
// 	  if(str.length > infoMaxLength) {
// 	    str = str.substr(0, infoMaxLength);
// 	    str = str.replace(/[^\w\]\)\}\>\.]+\w*$/, '...');
// 	  }
// 	  return str.toUpperCase();
// 	}

// 	function fadeIn(msg, json, img) {
// 	  curUrl = json.external_urls.spotify;

// 	  // track, artists, album info
// 	  var artists = joinArtists(json);
// 	  d3.select('#artists').text(formatInfo(artists));
// 	  d3.select('#album').text(formatInfo(json.album.name));
// 	  d3.select('#track').text(formatInfo(json.name));
// 	  var boringAlbumName = json.album.name == json.name || json.album.name == artists;
// 	  d3.select('#album').style('display', boringAlbumName ? 'none' : null);

// 	  // update locations
// 	  locations = msg.locations;
// 	  updateCityPositions();

// 	  // update city names
// 	  d3.select('#city0')
// 	    .text(msg.cities[0].toUpperCase())
// 	  d3.select('#city1')
// 	    .text(msg.cities[1].toUpperCase())

// 	  // start transitions
// 	  d3.selectAll('.impact')
// 	    .style('opacity', 1)
// 	    .attr('r', '0px')
// 	    .transition()
// 	    .duration(2000)
// 	    .ease('linear')
// 	    .attr('r', '300px')
// 	    .style('opacity', 0)

// 	  d3.select('#overlay')
// 	    .transition()
// 	    .duration(fadeInTime)
// 	    .ease('linear')
// 	    .style('opacity', 1)
// 	}

// 	function loadImage(url, cb) {
// 	  var img = new Image();
// 	  img.crossOrigin = 'anonymous';
// 	  img.onload = function() {
// 	      cb(img);
// 	  };
// 	  img.src = url;
// 	}
// (function() {
	
// 	var firstRender = true;
// 	function render(msg, json, img) {
// 	  if(firstRender) {
// 	    firstRender = false;
// 	    d3.select('#title')
// 	      .transition()
// 	      .duration(500)
// 	      .style('opacity', 0)
// 	      .each('end', function() {
// 	        d3.select('#info')
// 	          .style('opacity', 1);
// 	        d3.select('#splash')
// 	          .remove();
// 	      })
// 	  }
// 	  if(playing) {
// 	    if(!mobile) {
// 	      queueSong(json.preview_url);
// 	    }
// 	    fadeOut(function() {
// 	      changeView(msg.locations, function() {
// 	        fadeIn(msg, json, img);
// 	        swapSongs();
// 	      })
// 	    })
// 	  }
// 	}

// 	var eventQueue = [];
// 	function queueEvent(e) {
// 	  eventQueue.push(e);
// 	}
// 	function unqueueEvent() {
// 	  if(eventQueue.length) {
// 	    eventQueue.shift()();
// 	  }
// 	}
// 	setInterval(unqueueEvent, updateTime);

// 	function parse(msg) {
// 	  var cur = msg.split('\t');
// 	  return {
// 	    track_id: cur[0],
// 	    cities: [cur[1], cur[2]],
// 	    locations: [
// 	      [parseFloat(cur[3]), parseFloat(cur[4])],
// 	      [parseFloat(cur[5]), parseFloat(cur[6])]
// 	    ]
// 	  };
// 	}


// 	function setIntervalImmediate(func, delay) {
// 	  (function interval() {
// 	    func();
// 	    setTimeout(interval, delay);
// 	  })();
// 	}
// })();
