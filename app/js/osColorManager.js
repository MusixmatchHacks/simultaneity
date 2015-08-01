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
	* Given the requestId returns the name of the os from which the request is made from 
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
	* Given the requestId returns a unique color for the corresponding OS. Like green for Android e.t.c
	* @memberof osColorManager
	* @method getOsColor
	* @param {number} requestId - A unique number identifying a request 
	*/
	getOSColor(requestId) {
		let osName = this.getOSName(requestId);
		switch(osName) {
			case 'android' : 
				// return "#A4C639";
				return "#000";
				break;
			case 'mac_desktop' :
				// return "#FFFFFF";
				return "#000";
				break;
			case 'azlyrics' :
				return "#FFFFFF";
				break;
			case 'other' : 
				// return "#0000FF"
				return "#000";
				break;
			default : 
				// return "#5EA9DD";
				return "#000";
				break;
		}
	}
};

module.exports = colorManager;
