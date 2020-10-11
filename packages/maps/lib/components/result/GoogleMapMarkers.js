'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _types = require('@appbaseio/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _GoogleMapMarker = require('./GoogleMapMarker');

var _GoogleMapMarker2 = _interopRequireDefault(_GoogleMapMarker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GoogleMapMarkers = function (_React$Component) {
	_inherits(GoogleMapMarkers, _React$Component);

	function GoogleMapMarkers() {
		var _temp, _this, _ret;

		_classCallCheck(this, GoogleMapMarkers);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
			markerOnTop: null,
			openMarkers: {}
		}, _this.setMarkerOnTop = function (markerOnTop) {
			_this.setState({
				markerOnTop: markerOnTop
			});
		}, _this.setOpenMarkers = function (openMarkers) {
			_this.setState({
				openMarkers: openMarkers
			});
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	GoogleMapMarkers.prototype.render = function render() {
		var _this2 = this;

		var _props = this.props,
		    resultsToRender = _props.resultsToRender,
		    rest = _objectWithoutProperties(_props, ['resultsToRender']);

		var _state = this.state,
		    markerOnTop = _state.markerOnTop,
		    openMarkers = _state.openMarkers;

		return _react2.default.createElement(
			'div',
			null,
			resultsToRender.map(function (marker, index) {
				return _react2.default.createElement(
					_react2.default.Fragment,
					{ key: marker._id },
					_react2.default.createElement(_GoogleMapMarker2.default, _extends({}, rest, {
						index: index,
						marker: marker,
						markerOnTop: markerOnTop,
						openMarkers: openMarkers,
						setMarkerOnTop: _this2.setMarkerOnTop,
						setOpenMarkers: _this2.setOpenMarkers
					}))
				);
			})
		);
	};

	return GoogleMapMarkers;
}(_react2.default.Component);

GoogleMapMarkers.propTypes = {
	resultsToRender: _types2.default.hits,
	getPosition: _types2.default.func,
	renderData: _types2.default.func,
	defaultPin: _types2.default.string,
	autoClosePopover: _types2.default.bool,
	handlePreserveCenter: _types2.default.func,
	onPopoverClick: _types2.default.func,
	markerProps: _types2.default.props
};
exports.default = GoogleMapMarkers;