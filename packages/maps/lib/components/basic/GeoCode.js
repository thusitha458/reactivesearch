'use strict';

exports.__esModule = true;

var _react = require('react');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GeoCode = function (_Component) {
	_inherits(GeoCode, _Component);

	function GeoCode() {
		_classCallCheck(this, GeoCode);

		return _possibleConstructorReturn(this, _Component.apply(this, arguments));
	}

	GeoCode.prototype.getUserLocation = function getUserLocation() {
		var _this2 = this;

		navigator.geolocation.getCurrentPosition(function (location) {
			var coordinatesObj = {
				lat: location.coords.latitude,
				lng: location.coords.longitude
			};

			if (_this2.geocoder) {
				_this2.geocoder.geocode({ location: coordinatesObj }, function (results, status) {
					if (status === 'OK') {
						if (Array.isArray(results) && results.length) {
							var userLocation = results[0].formatted_address;
							_this2.setState({
								// eslint-disable-next-line react/no-unused-state
								userLocation: userLocation
							});
						}
					} else {
						console.error('Geocode was not successful for the following reason: ' + status);
					}
				});
			} else {
				console.error('No Geocoder found or defined');
			}
		});
	};

	GeoCode.prototype.getCoordinates = function getCoordinates(value, cb) {
		var _this3 = this;

		if (value) {
			if (this.geocoder) {
				this.geocoder.geocode({ address: value }, function (results, status) {
					if (status === 'OK') {
						if (Array.isArray(results) && results.length) {
							if (Array.isArray(results) && results.length) {
								var location = results[0].geometry.location;

								_this3.coordinates = location.lat() + ', ' + location.lng();
								if (cb) cb();
							}
						}
					} else {
						console.error('Geocode was not successful for the following reason: ' + status);
					}
				});
			} else {
				console.error('No Geocoder found or defined');
			}
		}
	};

	return GeoCode;
}(_react.Component);

exports.default = GeoCode;