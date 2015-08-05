/**
 * Stores names of the main services
 * @type {Object}
 * @memberof osNameMaps
 */
let main_service_names = {
	"service_windows" : "windows",
	"service_website" : "website",
	"service_android" : "android",
	"service_ios" : "ios",
	"service_azlyrics" : "azlyrics",
	"service_spotify" : "spotify",
	"service_mobile" : "mobile",
	"service_other" : "other"
};
/**
 * Maps ambiguous and redundant names to a more understandable serivce name.
 * @type {Object}
 * @namespace osNameMaps
 */
module.exports = {
	"win7" : main_service_names.service_window, "other" : main_service_names.service_other,
	"website" : main_service_names.website, "mobile" : main_service_names.service_mobile,
	"nokia" : main_service_names.service_mobile, "iphone" : main_service_names.service_ios,
	"android" : main_service_names.service_android, "songtexte" : main_service_names.service_other,
	"win_desktop" : main_service_names.service_windows, "mac_desktop" : main_service_names.service_other,
	"spotify" : main_service_names.service_spotify, "ipad" : main_service_names.service_ios,
	"win8" : main_service_names.service_windows, "google_glass" : main_service_names.service_other,
	"ios_clip" : main_service_names.service_ios, "mxm_website" : main_service_names.service_website,
	"name" : main_service_names.service_other, "azlyrics" : main_service_names.service_azlyrics,
	"mxm_chrome_ext" : main_service_names.serivce_other
};