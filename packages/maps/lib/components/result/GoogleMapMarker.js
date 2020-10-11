'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _core = require('@emotion/core');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MarkerWithLabel = require('react-google-maps/lib/components/addons/MarkerWithLabel');

var _reactGoogleMaps = require('react-google-maps');

var _types = require('@appbaseio/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _utils = require('@appbaseio/reactivesearch/lib/utils');

var _MapPin = require('./addons/styles/MapPin');

var _utils2 = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** @jsx jsx */


var GoogleMapMarker = function (_React$Component) {
	_inherits(GoogleMapMarker, _React$Component);

	function GoogleMapMarker() {
		var _temp, _this, _ret;

		_classCallCheck(this, GoogleMapMarker);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.triggerAnalytics = function () {
			// click analytics would only work client side and after javascript loads
			var _this$props = _this.props,
			    config = _this$props.config,
			    analytics = _this$props.analytics,
			    headers = _this$props.headers,
			    index = _this$props.index;


			(0, _utils2.triggerClickAnalytics)({
				config: config,
				headers: headers,
				analytics: analytics,
				searchPosition: index + 1,
				context: _this.context
			});
		}, _this.openMarker = function () {
			var _ref, _extends2;

			var _this$props2 = _this.props,
			    handleOpenMarkers = _this$props2.setOpenMarkers,
			    openMarkers = _this$props2.openMarkers,
			    marker = _this$props2.marker,
			    autoClosePopover = _this$props2.autoClosePopover,
			    handlePreserveCenter = _this$props2.handlePreserveCenter;

			var id = marker._id;
			var newOpenMarkers = autoClosePopover ? (_ref = {}, _ref[id] = true, _ref) : _extends({}, openMarkers, (_extends2 = {}, _extends2[id] = true, _extends2));

			handleOpenMarkers(newOpenMarkers);
			handlePreserveCenter(true);
			_this.triggerAnalytics();
		}, _this.closeMarker = function () {
			var _this$props3 = _this.props,
			    handleOpenMarkers = _this$props3.setOpenMarkers,
			    marker = _this$props3.marker,
			    autoClosePopover = _this$props3.autoClosePopover,
			    handlePreserveCenter = _this$props3.handlePreserveCenter,
			    openMarkers = _this$props3.openMarkers;

			var id = marker._id;

			var del = openMarkers[id],
			    activeMarkers = _objectWithoutProperties(openMarkers, [id]);

			var newOpenMarkers = autoClosePopover ? {} : activeMarkers;

			handleOpenMarkers(newOpenMarkers);
			handlePreserveCenter(true);
		}, _this.renderPopover = function (item) {
			var includeExternalSettings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var additionalProps = {};
			var _this$props4 = _this.props,
			    getPosition = _this$props4.getPosition,
			    onPopoverClick = _this$props4.onPopoverClick,
			    openMarkers = _this$props4.openMarkers;

			if (includeExternalSettings) {
				// to render pop-over correctly with MarkerWithLabel
				additionalProps = {
					position: getPosition(item),
					defaultOptions: {
						pixelOffset: new window.google.maps.Size(0, -30)
					}
				};
			}

			if (item._id in openMarkers) {
				return (0, _core.jsx)(
					_reactGoogleMaps.InfoWindow,
					_extends({
						zIndex: 500,
						key: item._id + '-InfoWindow',
						onCloseClick: function onCloseClick() {
							return _this.closeMarker();
						}
					}, additionalProps),
					(0, _core.jsx)(
						'div',
						null,
						onPopoverClick(item)
					)
				);
			}
			return null;
		}, _this.increaseMarkerZIndex = function () {
			var _this$props5 = _this.props,
			    handleTopMarker = _this$props5.setMarkerOnTop,
			    handlePreserveCenter = _this$props5.handlePreserveCenter,
			    marker = _this$props5.marker;

			handleTopMarker(marker._id);
			handlePreserveCenter(true);
		}, _this.removeMarkerZIndex = function () {
			var _this$props6 = _this.props,
			    handleTopMarker = _this$props6.setMarkerOnTop,
			    handlePreserveCenter = _this$props6.handlePreserveCenter;

			handleTopMarker(null);
			handlePreserveCenter(true);
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	GoogleMapMarker.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps) {
		if (nextProps.markerOnTop === this.props.marker._id || this.props.marker._id === this.props.markerOnTop && nextProps.markerOnTop === null) {
			return true;
		}

		if (this.props.openMarkers[this.props.marker._id] !== nextProps.openMarkers[this.props.marker._id]) {
			return true;
		}

		return false;
	};

	GoogleMapMarker.prototype.render = function render() {
		var _this2 = this;

		var _props = this.props,
		    getPosition = _props.getPosition,
		    renderData = _props.renderData,
		    defaultPin = _props.defaultPin,
		    autoClosePopover = _props.autoClosePopover,
		    handlePreserveCenter = _props.handlePreserveCenter,
		    onPopoverClick = _props.onPopoverClick,
		    customMarkerProps = _props.markerProps,
		    marker = _props.marker,
		    markerOnTop = _props.markerOnTop;


		var markerProps = {
			position: getPosition(marker)
		};

		if (markerOnTop === marker._id) {
			markerProps.zIndex = window.google.maps.Marker.MAX_ZINDEX + 1;
		}

		if (renderData) {
			var data = renderData(marker);

			if ('label' in data) {
				return (0, _core.jsx)(
					_MarkerWithLabel.MarkerWithLabel,
					_extends({
						key: marker._id,
						labelAnchor: new window.google.maps.Point(0, 30),
						icon: 'https://i.imgur.com/h81muef.png' // blank png to remove the icon
						, onClick: this.openMarker,
						onMouseOver: this.increaseMarkerZIndex,
						onFocus: this.increaseMarkerZIndex,
						onMouseOut: this.removeMarkerZIndex,
						onBlur: this.removeMarkerZIndex
					}, markerProps, customMarkerProps),
					(0, _core.jsx)(
						'div',
						{ css: _MapPin.mapPinWrapper },
						(0, _core.jsx)(
							_MapPin.MapPin,
							null,
							data.label
						),
						(0, _core.jsx)(_MapPin.MapPinArrow, null),
						onPopoverClick ? this.renderPopover(marker, true) : null
					)
				);
			} else if ('icon' in data) {
				markerProps.icon = data.icon;
			} else {
				return (0, _core.jsx)(
					_MarkerWithLabel.MarkerWithLabel,
					_extends({
						key: marker._id,
						labelAnchor: new window.google.maps.Point(0, 30),
						icon: 'https://i.imgur.com/h81muef.png' // blank png to remove the icon
						, onClick: this.openMarker,
						onMouseOver: this.increaseMarkerZIndex,
						onFocus: this.increaseMarkerZIndex,
						onMouseOut: this.removeMarkerZIndex,
						onBlur: this.removeMarkerZIndex
					}, markerProps, customMarkerProps),
					(0, _core.jsx)(
						'div',
						{ css: _MapPin.mapPinWrapper },
						data.custom,
						onPopoverClick ? this.renderPopover(marker, true) : null
					)
				);
			}
		} else if (defaultPin) {
			markerProps.icon = defaultPin;
		}

		return (0, _core.jsx)(
			_reactGoogleMaps.Marker,
			_extends({
				key: marker._id,
				onClick: function onClick() {
					return _this2.openMarker(marker._id, autoClosePopover || false, handlePreserveCenter);
				},
				onMouseOver: this.increaseMarkerZIndex,
				onFocus: this.increaseMarkerZIndex,
				onMouseOut: this.removeMarkerZIndex,
				onBlur: this.removeMarkerZIndex
			}, markerProps, markerProps),
			onPopoverClick ? this.renderPopover(marker) : null
		);
	};

	return GoogleMapMarker;
}(_react2.default.Component);

GoogleMapMarker.contextType = _utils.ReactReduxContext;


var mapStateToProps = function mapStateToProps(state) {
	return {
		config: state.config,
		headers: state.appbaseRef.headers,
		analytics: state.analytics
	};
};

GoogleMapMarker.propTypes = {
	getPosition: _types2.default.func,
	renderData: _types2.default.func,
	defaultPin: _types2.default.string,
	autoClosePopover: _types2.default.bool,
	handlePreserveCenter: _types2.default.func,
	onPopoverClick: _types2.default.func,
	markerProps: _types2.default.props,
	marker: _types2.default.props,
	openMarkers: _types2.default.props,
	openMarkerInfo: _types2.default.func,
	closeMarkerInfo: _types2.default.func,
	setMarkerOnTop: _types2.default.func,
	markerOnTop: _types2.default.string,
	setOpenMarkers: _types2.default.func,
	index: _types2.default.number,
	config: _types2.default.props,
	analytics: _types2.default.props,
	headers: _types2.default.headers
};

exports.default = (0, _utils.connect)(mapStateToProps, null)(GoogleMapMarker);