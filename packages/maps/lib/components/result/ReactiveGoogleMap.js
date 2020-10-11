'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactGoogleMaps = require('react-google-maps');

var _MarkerClusterer = require('react-google-maps/lib/components/addons/MarkerClusterer');

var _MarkerClusterer2 = _interopRequireDefault(_MarkerClusterer);

var _helper = require('@appbaseio/reactivecore/lib/utils/helper');

var _types = require('@appbaseio/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _Dropdown = require('@appbaseio/reactivesearch/lib/components/shared/Dropdown');

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _ReactiveMap = require('./ReactiveMap');

var _ReactiveMap2 = _interopRequireDefault(_ReactiveMap);

var _GoogleMapMarkers = require('./GoogleMapMarkers');

var _GoogleMapMarkers2 = _interopRequireDefault(_GoogleMapMarkers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Standard = require('./addons/styles/Standard');
var BlueEssence = require('./addons/styles/BlueEssence');
var BlueWater = require('./addons/styles/BlueWater');
var FlatMap = require('./addons/styles/FlatMap');
var LightMonochrome = require('./addons/styles/LightMonochrome');
var MidnightCommander = require('./addons/styles/MidnightCommander');
var UnsaturatedBrowns = require('./addons/styles/UnsaturatedBrowns');

var MapComponent = (0, _reactGoogleMaps.withGoogleMap)(function (props) {
	var children = props.children,
	    onMapMounted = props.onMapMounted,
	    allProps = _objectWithoutProperties(props, ['children', 'onMapMounted']);

	return _react2.default.createElement(
		_reactGoogleMaps.GoogleMap,
		_extends({ ref: onMapMounted }, allProps),
		children
	);
});

var ReactiveGoogleMap = function (_Component) {
	_inherits(ReactiveGoogleMap, _Component);

	function ReactiveGoogleMap(props) {
		_classCallCheck(this, ReactiveGoogleMap);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		_this.mapStyles = [{ label: 'Standard', value: Standard }, { label: 'Blue Essence', value: BlueEssence }, { label: 'Blue Water', value: BlueWater }, { label: 'Flat Map', value: FlatMap }, { label: 'Light Monochrome', value: LightMonochrome }, { label: 'Midnight Commander', value: MidnightCommander }, { label: 'Unsaturated Browns', value: UnsaturatedBrowns }];

		var currentMapStyle = _this.mapStyles.find(function (style) {
			return style.label === props.defaultMapStyle;
		}) || _this.mapStyles[0];

		_this.state = {
			currentMapStyle: currentMapStyle,
			mapRef: null,
			updaterKey: 0
		};
		return _this;
	}

	ReactiveGoogleMap.prototype.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
		if (this.props.defaultMapStyle !== prevProps.defaultMapStyle) {
			this.handleStyleChange(this.props.defaultMapStyle);
		}
	};

	ReactiveGoogleMap.prototype.render = function render() {
		return _react2.default.createElement(_ReactiveMap2.default, _extends({}, this.props, {
			renderMap: this.renderMap,
			mapRef: this.state.mapRef,
			updaterKey: this.state.updaterKey,
			mapService: _ReactiveMap.MAP_SERVICES.GOOGLE_MAP
		}));
	};

	return ReactiveGoogleMap;
}(_react.Component);

var _initialiseProps = function _initialiseProps() {
	var _this2 = this;

	this.handleStyleChange = function (newStyle) {
		_this2.setState(function (prevState) {
			return {
				currentMapStyle: _this2.mapStyles.find(function (style) {
					return style.label === newStyle;
				}) || _this2.mapStyles[0],
				updaterKey: prevState.updaterKey + 1
			};
		});
	};

	this.handleUpdaterKey = function () {
		_this2.setState(function (prevState) {
			return {
				updaterKey: prevState.updaterKey + 1
			};
		});
	};

	this.setMapStyle = function (currentMapStyle) {
		_this2.setState(function (prevState) {
			return {
				currentMapStyle: currentMapStyle,
				updaterKey: prevState.updaterKey + 1
			};
		});
	};

	this.renderMap = function (params) {
		if (typeof window === 'undefined' || window && typeof window.google === 'undefined') {
			return null;
		}

		var style = {
			width: '100%',
			height: '100%',
			position: 'relative'
		};

		var markerProps = {
			resultsToRender: params.resultsToRender,
			getPosition: params.getPosition,
			renderData: params.renderData,
			defaultPin: params.defaultPin,
			autoClosePopover: params.autoClosePopover,
			handlePreserveCenter: params.handlePreserveCenter,
			onPopoverClick: params.onPopoverClick,
			markerProps: _this2.props.markerProps
		};

		return _react2.default.createElement(
			'div',
			{ style: style },
			_react2.default.createElement(
				MapComponent,
				_extends({
					containerElement: _react2.default.createElement('div', { style: style }),
					mapElement: _react2.default.createElement('div', { style: { height: '100%' } }),
					onMapMounted: function onMapMounted(ref) {
						_this2.setState({
							mapRef: ref
						});
						if (params.innerRef && ref) {
							var map = Object.values(ref.context)[0];
							var mapRef = _extends({}, ref, { map: map });
							params.innerRef(mapRef);
						}
					},
					zoom: params.zoom,
					center: params.center
				}, params.mapProps, {
					onIdle: params.handleOnIdle,
					onZoomChanged: params.handleZoomChange,
					onDragEnd: params.handleOnDragEnd,
					options: _extends({
						styles: _this2.state.currentMapStyle.value
					}, (0, _helper.getInnerKey)(_this2.props.mapProps, 'options'), _this2.props.mapOptions)
				}),
				_this2.props.showMarkers && _this2.props.showMarkerClusters ? _react2.default.createElement(
					_MarkerClusterer2.default,
					{ averageCenter: true, enableRetinaIcons: true, gridSize: 60 },
					_react2.default.createElement(_GoogleMapMarkers2.default, markerProps)
				) : _react2.default.createElement(
					_react2.default.Fragment,
					null,
					_this2.props.showMarkers && _react2.default.createElement(_GoogleMapMarkers2.default, markerProps)
				),
				_this2.props.showMarkers && _this2.props.markers,
				params.renderSearchAsMove()
			),
			_this2.props.showMapStyles ? _react2.default.createElement(
				'div',
				{
					style: {
						position: 'absolute',
						top: 10,
						right: 46,
						width: 120,
						zIndex: window.google.maps.Marker.MAX_ZINDEX + 1
					}
				},
				_react2.default.createElement(_Dropdown2.default, {
					innerClass: _this2.props.innerClass,
					items: _this2.mapStyles,
					onChange: _this2.setMapStyle,
					selectedItem: _this2.state.currentMapStyle,
					keyField: 'label',
					returnsObject: true,
					small: true
				})
			) : null
		);
	};
};

ReactiveGoogleMap.propTypes = {
	autoCenter: _types2.default.bool,
	center: _types2.default.location,
	className: _types2.default.string,
	componentId: _types2.default.stringRequired,
	dataField: _types2.default.stringRequired,
	defaultCenter: _types2.default.location,
	defaultMapStyle: _types2.default.string,
	defaultPin: _types2.default.string,
	defaultQuery: _types2.default.func,
	defaultZoom: _types2.default.number,
	innerClass: _types2.default.style,
	innerRef: _types2.default.func,
	loader: _types2.default.title,
	mapProps: _types2.default.props,
	mapOptions: _types2.default.props,
	markerProps: _types2.default.props,
	markers: _types2.default.children,
	renderAllData: _types2.default.func,
	renderData: _types2.default.func,
	onPageChange: _types2.default.func,
	onPopoverClick: _types2.default.func,
	onData: _types2.default.func,
	pages: _types2.default.number,
	pagination: _types2.default.bool,
	renderPagination: _types2.default.func,
	react: _types2.default.react,
	searchAsMove: _types2.default.bool,
	showMapStyles: _types2.default.bool,
	showMarkerClusters: _types2.default.bool,
	showMarkers: _types2.default.bool,
	showSearchAsMove: _types2.default.bool,
	size: _types2.default.number,
	sortBy: _types2.default.sortBy,
	stream: _types2.default.bool,
	streamAutoCenter: _types2.default.bool,
	style: _types2.default.style,
	URLParams: _types2.default.bool,
	defaultRadius: _types2.default.number,
	unit: _types2.default.string,
	autoClosePopover: _types2.default.bool,
	renderMap: _types2.default.func,
	updaterKey: _types2.default.number,
	mapRef: _types2.default.any // eslint-disable-line
};

ReactiveGoogleMap.defaultProps = {
	autoClosePopover: true,
	size: 10,
	style: {},
	className: null,
	pages: 5,
	pagination: false,
	defaultMapStyle: 'Standard',
	autoCenter: false,
	streamAutoCenter: false,
	defaultZoom: 8,
	mapProps: {},
	markerProps: {},
	markers: null,
	showMapStyles: false,
	showSearchAsMove: true,
	searchAsMove: false,
	showMarkers: true,
	showMarkerClusters: true,
	unit: 'mi',
	defaultRadius: 100
};

exports.default = ReactiveGoogleMap;