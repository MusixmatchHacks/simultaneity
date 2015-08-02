let sampleData = require('./app_info.js');

/**
 * A module to export functionality of retreiving various informations from a given requestId
 * @namespace osColorManager
 */
let colorManager = {

	/**
	* Logs the Unique os names present in the sample data 
	* @memberof osColorManager
	* @method getUniqueOSNames
	*/
	logUniqueOSNames() {
		// Create a new set 
		let osNameSet = new Set();
		for(let requestId in sampleData) 
			osNameSet.add(sampleData[requestId]["name"]);

		// Now let us print all the unique names 
		for(let name of osNameSet) 
			console.log(name);
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
			return requestObject["name"];
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
		'color_android' : '#A4C639',
		'color_windows' : '#0670C4',
		'color_mac' : '#CCCCCC',
		'color_ios' : '#55ACEE',
		'color_azlyrics' : '#CCCCDD',
		'color_default' : '#D8D8D8'
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
			case 'android' : 
				return this.osColors.color_android;
				break;
			case 'win7' : 
			case 'win8' :
			case 'win_desktop' : 
				return this.osColors.color_windows;
				break;
			case 'mac_desktop' :
				return this.osColors.color_mac;
				break;
			case 'azlyrics' :
				return this.osColors.color_azlyrics;
				break;
			case 'ios_clip' : 
				return this.osColors.color_ios;
				break;
			default : 
				return this.osColors.color_default;
				break;
		}
	}
};

module.exports = colorManager;
