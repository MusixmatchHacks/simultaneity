let sampleData = require('./app_info.js');
let colorManager = {
	getOSName : function(requestId) {
		let requestObject = sampleData[requestId];
		if(requestObject !== undefined) {
			return requestObject["name"];
		} else {
			return '';
		}
	},

	getOSColor : function(requestId) {
		let osName = this.getOSName(requestId);
		switch(osName) {
			case 'android' : 
				return "#A4C639";
				break;
			case 'mac_desktop' :
				return "#FFFFFF";
				break;
			case 'other' : 
				return "#0000FF"
				break;
			default : 
				return "#5EA9DD";
				break;
		}
	}
};

module.exports = colorManager;