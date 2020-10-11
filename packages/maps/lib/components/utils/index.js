'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// eslint-disable-next-line
var hasGoogleMap = exports.hasGoogleMap = function hasGoogleMap() {
	return _typeof(window.google) === 'object' && _typeof(window.google.maps) === 'object';
};