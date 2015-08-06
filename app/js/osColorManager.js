let sampleData = require('./app_info.js');
let osNameMaps = require('./osNameMaps');

/**
 * A module to export functionality of retreiving various informations from a given requestId
 * @namespace osColorManager
 */
let colorManager = {

	/**
	* Logs the Unique os names present in the sample data 
	* @memberof osColorManager
	* @method getUniqueOSNames
	* @return {array} Array containing names of all the unique available operating systems
	*/
	getUniqueOSNames() {
		let osNames = [];
		// Create a new set 
		let osNameSet = new Set();
		for(let requestId in sampleData) 
			osNameSet.add(sampleData[requestId]["name"]);

		// Now let us print all the unique names 
		for(let name of osNameSet) 
			osNames.push(name);
		return osNames;
	},

	/**
	* Given the requestId returns the name of the os from which the request is made from.
	* Returns an empty string if passed in requestId cannot be validated
	* @memberof osColorManager
	* @method getOSName
	* @param {number} requestId - A unique number identifying a request 
	*/
	getOSName(requestId) {
		let requestObject = sampleData[requestId];
		if(requestObject !== undefined) {
			return osNameMaps[requestObject["name"]];
		} else {
			return '';
		}
	},

	/**
	 * An object that stores the HEX color codes for representing different operating systems
	 * @memberof  osColorManager
	 * @enum
	 */
	osColors : {
		'color_windows' : '#0670C4',
		'color_android' : '#ED462F',
		'color_website' : '#ffff99',
		'color_ios' : '#55ACEE',
		'color_azlyrics' : '#d8d8d8',
		'color_spotify' : '#fdc086',
		'color_mobile' : '#03509D',
		'color_other' : '#666666'
	},

	/**
	* Given the requestId returns a unique color for the corresponding OS. Like green for Android e.t.c
	* @memberof osColorManager
	* @method getOsColor
	* @param {number} requestId - A unique number identifying a request 
	*/
	getOSColor(requestId) {
		let osName = this.getOSName(requestId);
		switch(osName) {
			case 'windows' :
				return this.osColors.color_windows;
				break;
			case 'website' :
				return this.osColors.color_website;
				break;
			case 'android' :
				return this.osColors.color_android;
				break;
			case 'ios' :
				return this.osColors.color_ios;
				break;
			case 'azlylrics' :
				return this.osColors.color_azlyrics;
				break;
			case 'spotify' :
				return this.osColors.color_spotify;
				break;
			case 'mobile' :
				return this.osColors.color_mobile;
				break;
			case 'other' :
				return this.osColors.color_other;
				break;
			default : 
				return this.osColors.color_other;
				break;
		}
	}
};

module.exports = colorManager;
