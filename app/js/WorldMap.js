/**
 * Module that handles, rendering, positioning and everything on the world map. 
 * @namespace WorldMap
 */
let WorldMap = {
	/**
	 * Initializes and places the world map in the viewport
	 * @memberof WorldMap
	 * @method
	 */
	init() {
		this.width = window.innerWidth;
		this.height = window.innerHeight;

		this.labels = d3.select('#labels')
			.attr('width', this.width)
			.attr('height', this.height);

		let svg = d3.select('#world')
			.attr('width', this.width)
			.attr('height', this.height);

		this.projection = d3.geo.equirectangular()
			.scale(this.width / 5.7)
			.translate([this.width / 2, this.height / 2])
			.precision(.1);

		let path = d3.geo.path()
			.projection(this.projection);


		d3.json("./vendors/world.json", function(error, world) {
			if (error) throw error;

			svg.insert("path", ".graticule")
				.datum(topojson.feature(world, world.objects.land))
				.attr("class", "land")
				.attr("d", path);
		});

		d3.select(self.frameElement).style("height", this.height + "px");
	},

	/**
	 * Returns d3 projection, that can be used in other modules for caluclation related to positioning.
	 * @memberof WorldMap
	 * @method  getProjection
	 */
	getProjection() {
		return this.projection;
	},

	/**
	 * Returns an array holding width and height of the WorldMap
	 * @memberof WorldMap
	 * @method  getDimensions
	 */
	getDimensions() {
		return [this.width, this.height];
	}
};

module.exports = WorldMap;