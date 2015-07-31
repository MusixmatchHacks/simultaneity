var sampleData = require('./app_info.js');
var colorManager = {
	getOSName : function(requestId) {
		var requestObject = sampleData[requestId];
		if(requestObject !== undefined) {
			return requestObject["name"];
		} else {
			return '';
		}
	},

	getOSColor : function(requestId) {
		var osName = this.getOSName(requestId);
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