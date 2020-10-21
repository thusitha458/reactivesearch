'use strict';

exports.__esModule = true;
exports.MAP_SERVICES = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _actions = require('@appbaseio/reactivecore/lib/actions');

var _helper = require('@appbaseio/reactivecore/lib/utils/helper');

var _types = require('@appbaseio/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _constants = require('@appbaseio/reactivecore/lib/utils/constants');

var _utils = require('@appbaseio/reactivesearch/lib/utils');

var _Pagination = require('@appbaseio/reactivesearch/lib/components/result/addons/Pagination');

var _Pagination2 = _interopRequireDefault(_Pagination);

var _FormControlList = require('@appbaseio/reactivesearch/lib/styles/FormControlList');

var _ngeohash = require('ngeohash');

var _ngeohash2 = _interopRequireDefault(_ngeohash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Standard = require('./addons/styles/Standard');
var BlueEssence = require('./addons/styles/BlueEssence');
var BlueWater = require('./addons/styles/BlueWater');
var FlatMap = require('./addons/styles/FlatMap');
var LightMonochrome = require('./addons/styles/LightMonochrome');
var MidnightCommander = require('./addons/styles/MidnightCommander');
var UnsaturatedBrowns = require('./addons/styles/UnsaturatedBrowns');

var MAP_CENTER = {
	lat: 37.7749,
	lng: 122.4194
};

var MAP_SERVICES = exports.MAP_SERVICES = {
	GOOGLE_MAP: 'GOOGLE_MAP',
	OPEN_STREET_MAP: 'OPEN_STREET_MAP'
};

function getLocationObject(location) {
	var resultType = Array.isArray(location) ? 'array' : typeof location === 'undefined' ? 'undefined' : _typeof(location);
	switch (resultType) {
		case 'string':
			{
				if (location.indexOf(',') > -1) {
					var locationSplit = location.split(',');
					return {
						lat: parseFloat(locationSplit[0]),
						lng: parseFloat(locationSplit[1])
					};
				}
				var locationDecode = _ngeohash2.default.decode(location);
				return {
					lat: locationDecode.latitude,
					lng: locationDecode.longitude
				};
			}
		case 'array':
			{
				return {
					lat: location[1],
					lng: location[0]
				};
			}
		default:
			{
				return location;
			}
	}
}

function getPrecision(a) {
	if (isNaN(a)) return 0; // eslint-disable-line
	var e = 1;
	var p = 0;
	while (Math.round(a * e) / e !== a) {
		e *= 10;
		p += 1;
	}
	return p;
}

function withDistinctLat(loc, count) {
	var length = getPrecision(loc.lat);
	var noiseFactor = length >= 6 ? 4 : length - 2;
	// eslint-disable-next-line
	var suffix = 1 / Math.pow(10, noiseFactor) * count;
	var location = _extends({}, loc, {
		lat: parseFloat((loc.lat + suffix).toFixed(length))
	});
	return location;
}

var ReactiveMap = function (_Component) {
	_inherits(ReactiveMap, _Component);

	function ReactiveMap(props) {
		_classCallCheck(this, ReactiveMap);

		var _this = _possibleConstructorReturn(this, _Component.call(this, props));

		_initialiseProps.call(_this);

		_this.mapStyles = [{ label: 'Standard', value: Standard }, { label: 'Blue Essence', value: BlueEssence }, { label: 'Blue Water', value: BlueWater }, { label: 'Flat Map', value: FlatMap }, { label: 'Light Monochrome', value: LightMonochrome }, { label: 'Midnight Commander', value: MidnightCommander }, { label: 'Unsaturated Browns', value: UnsaturatedBrowns }];

		var currentMapStyle = _this.mapStyles.find(function (style) {
			return style.label === props.defaultMapStyle;
		}) || _this.mapStyles[0];

		var pageFromUrlParam = -1;
		if (_this.props.paginationUrlParam) {
			var urlParams = new URLSearchParams(window.location.search);
			if (urlParams.get(_this.props.paginationUrlParam)
			// eslint-disable-next-line no-restricted-globals
			&& !isNaN(Number(urlParams.get(_this.props.paginationUrlParam)))) {
				pageFromUrlParam = Math.max(Number(urlParams.get(_this.props.paginationUrlParam)) - 1, 0);
			}
		}

		_this.state = {
			currentMapStyle: currentMapStyle,
			from: (pageFromUrlParam > -1 ? pageFromUrlParam : props.currentPage) * props.size || 0,
			totalPages: 0,
			currentPage: pageFromUrlParam > -1 ? pageFromUrlParam : props.currentPage,
			mapBoxBounds: null,
			searchAsMove: props.searchAsMove,
			zoom: props.defaultZoom,
			preserveCenter: false
		};

		_this.internalComponent = props.componentId + '__internal';
		props.setQueryListener(props.componentId, props.onQueryChange, props.onError);
		// Update props in store
		props.setComponentProps(props.componentId, props, _constants.componentTypes.reactiveMap);
		props.setComponentProps(_this.internalComponent, props, _constants.componentTypes.reactiveMap);
		return _this;
	}

	ReactiveMap.prototype.componentDidMount = function componentDidMount() {
		this.props.addComponent(this.internalComponent);
		this.props.addComponent(this.props.componentId);

		if (this.props.stream) {
			this.props.setStreaming(this.props.componentId, true);
		}

		var options = (0, _helper.getQueryOptions)(this.props);
		options.from = this.state.from;
		if (this.props.sortBy) {
			var _ref;

			options.sort = [(_ref = {}, _ref[this.props.dataField] = {
				order: this.props.sortBy
			}, _ref)];
		}

		this.defaultQuery = null;
		if (this.props.defaultQuery) {
			this.defaultQuery = this.props.defaultQuery();
			// Override sort query with defaultQuery's sort if defined
			if (this.defaultQuery.sort) {
				options.sort = this.defaultQuery.sort;
			}

			// since we want defaultQuery to be executed anytime
			// map component's query is being executed
			var persistMapQuery = true;
			// no need to forceExecute because setReact() will capture the main query
			// and execute the defaultQuery along with it
			var forceExecute = false;

			// Update default query for RS API
			this.setDefaultQueryForRSAPI();

			this.props.setMapData(this.props.componentId, this.defaultQuery.query, persistMapQuery, forceExecute);
		} else {
			// only apply geo-distance when defaultQuery prop is not set
			var query = this.getGeoDistanceQuery();
			if (query) {
				// - only persist the map query if center prop is set
				// - ideally, persist the map query if you want to keep executing it
				//   whenever there is a change (due to subscription) in the component query
				var _persistMapQuery = !!this.props.center;

				// - forceExecute will make sure that the component query + Map query gets executed
				//   irrespective of the changes in the component query
				// - forceExecute will only come into play when searchAsMove is true
				// - kindly note that forceExecute may result in one additional network request
				//   since it bypasses the gatekeeping
				var _forceExecute = this.state.searchAsMove;
				// Set meta for `distance` and `coordinates` in selected value
				var center = this.props.center || this.props.defaultCenter;
				var coordinatesObject = this.getArrPosition(center);
				var meta = {
					distance: this.props.defaultRadius,
					coordinates: coordinatesObject.lat + ', ' + coordinatesObject.lon
				};
				this.props.setMapData(this.props.componentId, query, _persistMapQuery, _forceExecute, meta);
			}
		}

		this.props.setQueryOptions(this.props.componentId, options, !(this.defaultQuery && this.defaultQuery.query));
		this.setReact(this.props);
	};

	ReactiveMap.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkSomePropChange)(this.props, prevProps, (0, _utils.getValidPropsKeys)(this.props), function () {
			_this2.props.updateComponentProps(_this2.props.componentId, _this2.props, _constants.componentTypes.reactiveMap);
			_this2.props.updateComponentProps(_this2.internalComponent, _this2.props, _constants.componentTypes.reactiveMap);
		});

		var updatedState = {};
		if (this.props.sortBy !== prevProps.sortBy || this.props.size !== prevProps.size || !(0, _helper.isEqual)(this.props.dataField, prevProps.dataField)) {
			var options = (0, _helper.getQueryOptions)(this.props);
			options.from = 0;
			if (this.props.sortBy) {
				var _ref2;

				options.sort = [(_ref2 = {}, _ref2[this.props.dataField] = {
					order: this.props.sortBy
				}, _ref2)];
			}

			updatedState.from = 0;
			updatedState.currentPage = 0;
			this.props.setQueryOptions(this.props.componentId, options, true);
		}

		if (this.props.onData) {
			(0, _helper.checkSomePropChange)(this.props, prevProps, ['hits', 'promotedResults', 'customData', 'total', 'size', 'time', 'hidden', 'streamHits'], function () {
				_this2.props.onData(_this2.getData());
			});
		}

		if (!(0, _helper.isEqual)(this.props.center, prevProps.center)) {
			var persistMapQuery = !!this.props.center;
			// we need to forceExecute the query because the center has changed
			var forceExecute = true;
			var geoQuery = this.getGeoQuery(this.props);
			// Update default query for RS API
			this.setDefaultQueryForRSAPI();
			var meta = {
				mapBoxBounds: this.state.mapBoxBounds
			};
			this.props.setMapData(this.props.componentId, geoQuery, persistMapQuery, forceExecute, meta);
		}

		if (prevProps.defaultQuery && !(0, _helper.isEqual)(prevProps.defaultQuery(), this.defaultQuery)) {
			var _options = (0, _helper.getQueryOptions)(prevProps);
			_options.from = this.state.from;
			this.defaultQuery = this.props.defaultQuery();

			var _defaultQuery = this.defaultQuery,
			    sort = _defaultQuery.sort,
			    query = _defaultQuery.query;


			if (sort) {
				_options.sort = this.defaultQuery.sort;
				this.props.setQueryOptions(this.props.componentId, _options, !query);
			}

			var _persistMapQuery2 = true;
			var _forceExecute2 = true;
			// Update default query to include the geo bounding box query
			this.setDefaultQueryForRSAPI();
			this.props.setMapData(this.props.componentId, query, _persistMapQuery2, _forceExecute2);
		}

		if (this.props.stream !== prevProps.stream) {
			this.props.setStreaming(this.props.componentId, this.props.stream);
		}

		if (!(0, _helper.isEqual)(prevProps.react, this.props.react)) {
			this.setReact(this.props);
		}

		// called when page is changed
		if (this.props.pagination && this.props.isLoading) {
			if (this.props.onPageChange) {
				this.props.onPageChange();
			}
		}

		if (!this.props.pagination && this.props.hits && prevProps.hits && this.props.hits.length < prevProps.hits.length) {
			if (this.props.onPageChange) {
				this.props.onPageChange();
			}
			updatedState.from = 0;
		}

		if (this.props.pagination && this.props.total !== prevProps.total) {
			updatedState.totalPages = Math.ceil(this.props.total / this.props.size);
			updatedState.currentPage = prevProps.total ? 0 : this.state.currentPage;
			if (prevProps.total && this.props.paginationUrlParam) {
				this.props.setPageURL(this.props.paginationUrlParam, 1, this.props.paginationUrlParam, false, true);
			}
			if (prevProps.total === undefined && this.props.defaultQuery) {
				// after first load only
				var _options2 = (0, _helper.getQueryOptions)(this.props);
				_options2.from = 0;
				var _sort = this.defaultQuery.sort;

				if (_sort) {
					_options2.sort = _sort;
				}
				this.props.setQueryOptions(this.props.componentId, _options2, false);
			}
		}

		if (this.props.searchAsMove !== prevProps.searchAsMove) {
			updatedState.searchAsMove = this.props.searchAsMove;
		}

		if (this.props.defaultZoom !== prevProps.defaultZoom && !isNaN(this.props.defaultZoom) && // eslint-disable-line
		this.props.defaultZoom) {
			updatedState.zoom = this.props.defaultZoom;
		}

		if (this.props.defaultMapStyle !== prevProps.defaultMapStyle) {
			updatedState.currentMapStyle = this.mapStyles.find(function (style) {
				return style.label === _this2.props.defaultMapStyle;
			}) || this.mapStyles[0];
		}

		this.updateState(updatedState);
	};

	ReactiveMap.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
		if (this.props.showSearchAsMove !== nextProps.showSearchAsMove || this.state.searchAsMove !== nextState.searchAsMove || this.props.showMapStyles !== nextProps.showMapStyles || this.props.autoCenter !== nextProps.autoCenter || this.props.isLoading !== nextProps.isLoading || this.props.error !== nextProps.error || this.props.streamAutoCenter !== nextProps.streamAutoCenter || this.props.defaultZoom !== nextProps.defaultZoom || this.props.showMarkerClusters !== nextProps.showMarkerClusters || !(0, _helper.isEqual)(this.state.currentMapStyle, nextState.currentMapStyle) || this.props.updaterKey !== nextProps.updaterKey) {
			return true;
		}

		if ((0, _helper.isEqual)(this.props.hits, nextProps.hits) && (0, _helper.isEqual)(this.props.streamHits, nextProps.streamHits)) {
			return false;
		}
		return true;
	};

	ReactiveMap.prototype.componentWillUnmount = function componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
		this.props.removeComponent(this.internalComponent);
	};

	// getArrPosition = location => [location.lat, location.lon || location.lng];


	ReactiveMap.prototype.parseLocation = function parseLocation(location) {
		if (Array.isArray(location)) {
			return {
				lat: Number(location[0]),
				lng: Number(location[1])
			};
		}
		return {
			lat: location ? Number(location.lat) : this.props.defaultCenter.lat,
			lng: location ? Number(location.lon === undefined ? location.lng : location.lon) : this.props.defaultCenter.lng
		};
	};

	ReactiveMap.prototype.render = function render() {
		var _this3 = this;

		var style = {
			width: '100%',
			height: '100vh',
			position: 'relative'
		};

		// console.log('RENDERING...', this.state.currentPage, this.state.totalPages);

		return _react2.default.createElement(
			'div',
			{ style: _extends({}, style, this.props.style), className: this.props.className },
			this.renderError(),
			this.shouldRenderLoader ? this.props.loader : null,
			!this.shouldRenderLoader && (this.props.renderAllData ? this.props.renderAllData(this.withClickIds((0, _helper.parseHits)(this.props.hits)), this.withClickIds((0, _helper.parseHits)(this.props.streamHits)), this.loadMore, function () {
				return _this3.props.renderMap(_this3.mapParams);
			}, function () {
				return _this3.renderPagination();
			}, this.triggerAnalytics, this.getData()) // prettier-ignore
			: this.props.renderMap(this.mapParams))
		);
	};

	_createClass(ReactiveMap, [{
		key: 'shouldRenderLoader',
		get: function get() {
			return this.props.loader && this.props.isLoading;
		}
	}, {
		key: 'mapParams',
		get: function get() {
			var resultsToRender = this.getResultsToRender();
			var _props = this.props,
			    showMarkers = _props.showMarkers,
			    renderData = _props.renderData,
			    defaultPin = _props.defaultPin,
			    onPopoverClick = _props.onPopoverClick,
			    autoClosePopover = _props.autoClosePopover,
			    markerProps = _props.markerProps,
			    innerRef = _props.innerRef;

			return {
				resultsToRender: resultsToRender,
				center: this.getCenter(resultsToRender),
				getPosition: this.getPosition,
				zoom: this.state.zoom,
				showMarkers: showMarkers,
				renderData: renderData,
				defaultPin: defaultPin,
				onPopoverClick: onPopoverClick,
				autoClosePopover: autoClosePopover,
				renderSearchAsMove: this.renderSearchAsMove,
				markerProps: markerProps,
				innerRef: innerRef,
				handlePreserveCenter: this.handlePreserveCenter,
				preserveCenter: this.state.preserveCenter,
				handleOnDragEnd: this.handleOnDragEnd,
				handleOnIdle: this.handleOnIdle,
				handleZoomChange: this.handleZoomChange
			};
		}
	}]);

	return ReactiveMap;
}(_react.Component);

ReactiveMap.contextType = _utils.ReactReduxContext;

var _initialiseProps = function _initialiseProps() {
	var _this4 = this;

	this.updateState = function (newState) {
		_this4.setState(_extends({}, newState));
	};

	this.getAllData = function () {
		var _props2 = _this4.props,
		    size = _props2.size,
		    promotedResults = _props2.promotedResults,
		    customData = _props2.customData;
		var currentPage = _this4.state.currentPage;

		var results = (0, _helper.parseHits)(_this4.props.hits) || [];
		var streamResults = (0, _helper.parseHits)(_this4.props.streamHits) || [];
		var parsedPromotedResults = (0, _helper.parseHits)(promotedResults) || [];
		var filteredResults = results;
		var base = currentPage * size;
		if (streamResults.length) {
			var ids = streamResults.map(function (item) {
				return item._id;
			});
			filteredResults = filteredResults.filter(function (item) {
				return !ids.includes(item._id);
			});
		}

		if (parsedPromotedResults.length) {
			var _ids = parsedPromotedResults.map(function (item) {
				return item._id;
			}).filter(Boolean);
			if (_ids) {
				filteredResults = filteredResults.filter(function (item) {
					return !_ids.includes(item._id);
				});
			}

			filteredResults = [].concat(streamResults, parsedPromotedResults, filteredResults);
		}
		return {
			results: results,
			streamResults: streamResults,
			filteredResults: filteredResults,
			promotedResults: parsedPromotedResults,
			customData: customData || {},
			loadMore: _this4.loadMore,
			base: base,
			triggerClickAnalytics: _this4.triggerClickAnalytics
		};
	};

	this.getData = function () {
		var _getAllData = _this4.getAllData(),
		    streamResults = _getAllData.streamResults,
		    filteredResults = _getAllData.filteredResults,
		    promotedResults = _getAllData.promotedResults,
		    customData = _getAllData.customData;

		return {
			data: _this4.withClickIds(filteredResults),
			streamData: _this4.withClickIds(streamResults),
			promotedData: _this4.withClickIds(promotedResults),
			customData: customData,
			rawData: _this4.props.rawData,
			resultStats: (0, _helper.getResultStats)(_this4.props)
		};
	};

	this.setReact = function (props) {
		var react = props.react;

		if (react) {
			var newReact = (0, _helper.pushToAndClause)(react, _this4.internalComponent);
			props.watchComponent(props.componentId, newReact);
		} else {
			props.watchComponent(props.componentId, { and: _this4.internalComponent });
		}
	};

	this.setDefaultQueryForRSAPI = function () {
		if (_this4.props.defaultQuery && typeof _this4.props.defaultQuery === 'function') {
			var defaultQuery = _this4.props.defaultQuery();
			if (_this4.state.mapBoxBounds) {
				var _geo_bounding_box;

				var geoQuery = {
					geo_bounding_box: (_geo_bounding_box = {}, _geo_bounding_box[_this4.props.dataField] = _this4.state.mapBoxBounds, _geo_bounding_box)
				};

				var _defaultQuery2 = defaultQuery,
				    query = _defaultQuery2.query,
				    options = _objectWithoutProperties(_defaultQuery2, ['query']);

				if (query) {
					// adds defaultQuery's query to geo-query
					// to generate a map query
					defaultQuery = _extends({
						query: {
							must: [geoQuery, query]
						}
					}, options);
				}
			}
			_this4.props.setDefaultQuery(_this4.props.componentId, defaultQuery);
			_this4.props.updateQuery({
				componentId: _this4.internalComponent,
				query: defaultQuery
			}, true);
		}
	};

	this.getHitsCenter = function (hits) {
		var data = hits.map(function (hit) {
			return hit[_this4.props.dataField];
		});

		if (data.length) {
			var numCoords = data.length;

			var X = 0.0;
			var Y = 0.0;
			var Z = 0.0;

			data.forEach(function (location) {
				if (location) {
					var _lat = 0.0;
					var _lng = 0.0;

					var locationObj = getLocationObject(location);
					_lat = locationObj.lat * Math.PI / 180;
					_lng = (locationObj.lng !== undefined ? locationObj.lng : locationObj.lon) * Math.PI / 180;

					var a = Math.cos(_lat) * Math.cos(_lng);
					var b = Math.cos(_lat) * Math.sin(_lng);
					var c = Math.sin(_lat);

					X += a;
					Y += b;
					Z += c;
				}
			});

			X /= numCoords;
			Y /= numCoords;
			Z /= numCoords;

			var lng = Math.atan2(Y, X);
			// eslint-disable-next-line
			var hyp = Math.sqrt(X * X + Y * Y);
			var lat = Math.atan2(Z, hyp);

			var newX = lat * 180 / Math.PI;
			var newY = lng * 180 / Math.PI;

			return {
				lat: newX,
				lng: newY
			};
		}
		return false;
	};

	this.getArrPosition = function (location) {
		return { lat: location.lat, lon: location.lon || location.lng };
	};

	this.getGeoDistanceQuery = function () {
		var center = _this4.props.center || _this4.props.defaultCenter;
		if (center && _this4.props.defaultRadius) {
			var _geo_distance;

			// skips geo bounding box query on initial load
			_this4.skipBoundingBox = true;
			return {
				geo_distance: (_geo_distance = {
					distance: '' + _this4.props.defaultRadius + _this4.props.unit
				}, _geo_distance[_this4.props.dataField] = _this4.getArrPosition(center), _geo_distance)
			};
		}
		return null;
	};

	this.getGeoQuery = function () {
		var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _this4.props;

		_this4.defaultQuery = props.defaultQuery ? props.defaultQuery() : null;

		var mapBounds = _this4.props.mapRef && typeof _this4.props.mapRef.getBounds === 'function' ? _this4.props.mapRef.getBounds() : false;

		var north = void 0;
		var south = void 0;
		var east = void 0;
		var west = void 0;

		if (mapBounds) {
			var _geo_bounding_box2;

			switch (_this4.props.mapService) {
				case MAP_SERVICES.GOOGLE_MAP:
					north = mapBounds.getNorthEast().lat();
					south = mapBounds.getSouthWest().lat();
					east = mapBounds.getNorthEast().lng();
					west = mapBounds.getSouthWest().lng();
					break;
				case MAP_SERVICES.OPEN_STREET_MAP:
					north = mapBounds._northEast.lat;
					south = mapBounds._southWest.lat;
					east = mapBounds._northEast.lng;
					west = mapBounds._southWest.lng;
					break;
				default:
					north = null;
					south = null;
					east = null;
					west = null;
			}

			var boundingBoxCoordinates = {
				top_left: [west, north],
				bottom_right: [east, south]
			};

			_this4.setState({
				mapBoxBounds: boundingBoxCoordinates
			});

			var geoQuery = {
				geo_bounding_box: (_geo_bounding_box2 = {}, _geo_bounding_box2[_this4.props.dataField] = boundingBoxCoordinates, _geo_bounding_box2)
			};

			if (_this4.defaultQuery) {
				var query = _this4.defaultQuery.query;


				if (query) {
					// adds defaultQuery's query to geo-query
					// to generate a map query

					return {
						must: [geoQuery, query]
					};
				}
			}

			return geoQuery;
		}

		// return the defaultQuery (if set) or null when map query not available
		return _this4.defaultQuery ? _this4.defaultQuery.query : null;
	};

	this.setGeoQuery = function () {
		var executeUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

		// execute a new query on the initial mount
		// or whenever searchAsMove is true and the map is dragged
		if (executeUpdate || !_this4.skipBoundingBox && !_this4.state.mapBoxBounds) {
			_this4.defaultQuery = _this4.getGeoQuery();

			var persistMapQuery = !!_this4.props.center;
			var forceExecute = _this4.state.searchAsMove;
			var meta = {
				mapBoxBounds: _this4.state.mapBoxBounds
			};
			_this4.props.setMapData(_this4.props.componentId, _this4.defaultQuery, persistMapQuery, forceExecute, meta);
		}
		_this4.skipBoundingBox = false;
	};

	this.loadMore = function () {
		if (_this4.props.hits && !_this4.props.pagination && _this4.props.total !== _this4.props.hits.length) {
			var value = _this4.state.from + _this4.props.size;
			var options = (0, _helper.getQueryOptions)(_this4.props);

			_this4.setState({
				from: value
			});
			_this4.props.loadMore(_this4.props.componentId, _extends({}, options, {
				from: value
			}), true);
		}
	};

	this.setPage = function (page) {
		var value = _this4.props.size * page;
		var options = (0, _helper.getQueryOptions)(_this4.props);
		options.from = _this4.state.from;
		_this4.setState({
			from: value,
			currentPage: page
		});
		_this4.props.loadMore(_this4.props.componentId, _extends({}, options, {
			from: value
		}), false);

		if (_this4.props.URLParams) {
			_this4.props.setPageURL(_this4.props.componentId + '-page', page + 1, _this4.props.componentId + '-page', false, true);
		}
		if (_this4.props.paginationUrlParam) {
			_this4.props.setPageURL(_this4.props.paginationUrlParam, page + 1, _this4.props.paginationUrlParam, false, true);
		}
	};

	this.getPosition = function (result) {
		if (result) {
			return _this4.parseLocation(result[_this4.props.dataField]);
		}
		return null;
	};

	this.getCenter = function (hits) {
		if (_this4.props.center) {
			return _this4.parseLocation(_this4.props.center);
		}

		if (_this4.props.mapRef && typeof _this4.props.mapRef.getCenter === 'function' && _this4.state.preserveCenter || _this4.props.stream && _this4.props.streamHits.length && !_this4.props.streamAutoCenter) {
			var currentCenter = _this4.props.mapRef.getCenter();
			setTimeout(function () {
				_this4.setState({
					preserveCenter: false
				});
			}, 100);
			if (_this4.props.mapService === MAP_SERVICES.GOOGLE_MAP) {
				return _this4.parseLocation({
					lat: currentCenter.lat(),
					lng: currentCenter.lng()
				});
			}

			return _this4.parseLocation({
				lat: currentCenter.lat,
				lng: currentCenter.lng
			});
		}

		if (hits && hits.length) {
			if (_this4.props.autoCenter || _this4.props.streamAutoCenter) {
				return _this4.getHitsCenter(hits) || _this4.getDefaultCenter();
			}
			return hits[0] && hits[0][_this4.props.dataField] ? _this4.getPosition(hits[0]) : _this4.getDefaultCenter();
		}
		return _this4.getDefaultCenter();
	};

	this.getDefaultCenter = function () {
		if (_this4.props.defaultCenter) return _this4.parseLocation(_this4.props.defaultCenter);
		return _this4.parseLocation(MAP_CENTER);
	};

	this.toggleSearchAsMove = function () {
		_this4.setState({
			searchAsMove: !_this4.state.searchAsMove
		});
	};

	this.renderError = function () {
		var _props3 = _this4.props,
		    error = _props3.error,
		    renderError = _props3.renderError;
		var isLoading = _this4.props.isLoading;

		if (renderError && error && !isLoading) {
			return (0, _utils.isFunction)(renderError) ? renderError(error) : renderError;
		}
		return null;
	};

	this.renderSearchAsMove = function () {
		if (_this4.props.showSearchAsMove) {
			return _react2.default.createElement(
				'div',
				{
					style: {
						position: 'absolute',
						bottom: 30,
						left: 10,
						width: 240,
						backgroundColor: '#fff',
						padding: '8px 10px',
						boxShadow: 'rgba(0,0,0,0.3) 0px 1px 4px -1px',
						borderRadius: 2,
						zIndex: 10000
					},
					className: (0, _helper.getClassName)(_this4.props.innerClass, 'checkboxContainer') || null
				},
				_react2.default.createElement(_FormControlList.Checkbox, {
					className: (0, _helper.getClassName)(_this4.props.innerClass, 'checkbox') || null,
					id: 'searchasmove',
					onChange: _this4.toggleSearchAsMove,
					checked: _this4.state.searchAsMove
				}),
				_react2.default.createElement(
					'label',
					{
						className: (0, _helper.getClassName)(_this4.props.innerClass, 'label') || null,
						htmlFor: 'searchasmove'
					},
					'Search as I move the map'
				)
			);
		}

		return null;
	};

	this.addNoise = function (hits) {
		var hitMap = {};
		var updatedHits = [];

		hits.forEach(function (item) {
			var updatedItem = _extends({}, item);
			var location = _this4.parseLocation(item[_this4.props.dataField]);
			var key = JSON.stringify(location);
			var count = hitMap[key] || 0;

			updatedItem[_this4.props.dataField] = count ? withDistinctLat(location, count) : location;
			updatedHits = [].concat(updatedHits, [updatedItem]);

			hitMap[key] = count + 1;
		});
		return updatedHits;
	};

	this.renderPagination = function () {
		var paginationProps = {
			pages: _this4.props.pages,
			totalPages: _this4.state.totalPages,
			currentPage: _this4.state.currentPage,
			setPage: _this4.setPage,
			innerClass: _this4.props.innerClass,
			fragmentName: _this4.props.componentId
		};

		if (_this4.props.renderPagination) {
			return _this4.props.renderPagination(paginationProps);
		}
		return _react2.default.createElement(_Pagination2.default, paginationProps);
	};

	this.getResultsToRender = function () {
		var results = (0, _helper.parseHits)(_this4.props.hits) || [];
		var streamResults = (0, _helper.parseHits)(_this4.props.streamHits) || [];
		var filteredResults = results.filter(function (item) {
			return !!item[_this4.props.dataField];
		});

		if (streamResults.length) {
			var ids = streamResults.map(function (item) {
				return item._id;
			});
			filteredResults = filteredResults.filter(function (item) {
				return !ids.includes(item._id);
			});
		}

		filteredResults = [].concat(streamResults, filteredResults).map(function (item) {
			var _extends2;

			return _extends({}, item, (_extends2 = {}, _extends2[_this4.props.dataField] = getLocationObject(item[_this4.props.dataField]), _extends2));
		});

		var resultsToRender = _this4.addNoise(filteredResults);
		return resultsToRender;
	};

	this.handlePreserveCenter = function (preserveCenter) {
		_this4.setState({
			preserveCenter: preserveCenter
		});
	};

	this.handleOnIdle = function () {
		// only make the geo_bounding query if we have hits data
		if (_this4.props.hits.length && _this4.state.searchAsMove) {
			// always execute geo-bounds query when center is set
			// to improve the specificity of search results
			var executeUpdate = !!_this4.props.center;
			_this4.setGeoQuery(executeUpdate);
		}
		if (_this4.props.mapProps.onIdle) _this4.props.mapProps.onIdle();
	};

	this.handleOnDragEnd = function () {
		if (_this4.state.searchAsMove) {
			_this4.setState({
				preserveCenter: true
			}, function () {
				_this4.setGeoQuery(true);
			});
		}
		if (_this4.props.mapProps.onDragEnd) _this4.props.mapProps.onDragEnd();
	};

	this.handleZoomChange = function () {
		var zoom = _this4.props.mapRef && typeof _this4.props.mapRef.getZoom === 'function' ? _this4.props.mapRef.getZoom() : false;
		if (zoom) {
			if (_this4.state.searchAsMove) {
				_this4.setState({
					zoom: zoom,
					preserveCenter: true
				}, function () {
					_this4.setGeoQuery(true);
				});
			} else {
				_this4.setState({
					zoom: zoom
				});
			}
			if (_this4.props.mapProps.onZoomChanged) _this4.props.mapProps.onZoomChanged();
		}
	};

	this.triggerAnalytics = function (searchPosition, documentId) {
		// click analytics would only work client side and after javascript loads
		var docId = documentId;
		if (!docId) {
			var _getData = _this4.getData(),
			    data = _getData.data;

			var hitData = data.find(function (hit) {
				return hit._click_id === searchPosition;
			});
			if (hitData && hitData._id) {
				docId = hitData._id;
			}
		}
		_this4.props.triggerAnalytics(searchPosition, docId);
	};

	this.withClickIds = function (hits) {
		var _props4 = _this4.props,
		    currentPage = _props4.currentPage,
		    size = _props4.size;

		var base = currentPage * size;

		return hits.map(function (hit, index) {
			return _extends({}, hit, {
				_click_id: base + index + 1
			});
		});
	};
};

ReactiveMap.propTypes = {
	addComponent: _types2.default.funcRequired,
	setMapData: _types2.default.funcRequired,
	loadMore: _types2.default.funcRequired,
	removeComponent: _types2.default.funcRequired,
	setQueryListener: _types2.default.funcRequired,
	setDefaultQuery: _types2.default.funcRequired,
	setComponentProps: _types2.default.funcRequired,
	updateComponentProps: _types2.default.funcRequired,
	onQueryChange: _types2.default.func,
	setPageURL: _types2.default.func,
	setQueryOptions: _types2.default.funcRequired,
	setStreaming: _types2.default.func,
	updateQuery: _types2.default.funcRequired,
	watchComponent: _types2.default.funcRequired,
	currentPage: _types2.default.number,
	hits: _types2.default.hits,
	isLoading: _types2.default.bool,
	streamHits: _types2.default.hits,
	time: _types2.default.number,
	total: _types2.default.number,
	url: _types2.default.string,
	config: _types2.default.props,
	analytics: _types2.default.props,
	headers: _types2.default.headers,
	mapService: _types2.default.stringRequired,
	promotedResults: _types2.default.hits,
	customData: _types2.default.title,
	hidden: _types2.default.number,
	rawData: _types2.default.rawData,
	triggerAnalytics: _types2.default.funcRequired,
	// component props
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
	error: _types2.default.title,
	innerClass: _types2.default.style,
	innerRef: _types2.default.func,
	loader: _types2.default.title,
	mapProps: _types2.default.props,
	markerProps: _types2.default.props,
	markers: _types2.default.children,
	renderAllData: _types2.default.func,
	renderData: _types2.default.func,
	renderError: _types2.default.title,
	onPageChange: _types2.default.func,
	onError: _types2.default.func,
	onData: _types2.default.func,
	onPopoverClick: _types2.default.func,
	pages: _types2.default.number,
	pagination: _types2.default.bool,
	renderPagination: _types2.default.func,
	paginationUrlParam: _types2.default.string,
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

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		mapKey: state.config.mapKey,
		hits: state.hits[props.componentId] && state.hits[props.componentId].hits || [],
		streamHits: state.streamHits[props.componentId] || [],
		currentPage: state.selectedValues[props.componentId + '-page'] && state.selectedValues[props.componentId + '-page'].value - 1 || 0,
		time: state.hits[props.componentId] && state.hits[props.componentId].time || 0,
		error: state.error[props.componentId],
		isLoading: state.isLoading[props.componentId] || false,
		total: state.hits[props.componentId] && state.hits[props.componentId].total,
		config: state.config,
		headers: state.appbaseRef.headers,
		analytics: state.analytics,
		rawData: state.rawData[props.componentId],
		promotedResults: state.promotedResults[props.componentId] || [],
		customData: state.customData[props.componentId],
		hidden: state.hits[props.componentId] && state.hits[props.componentId].hidden,
		queryLog: state.queryLog[props.componentId]
	};
};

var mapDispatchtoProps = function mapDispatchtoProps(dispatch) {
	return {
		addComponent: function addComponent(component) {
			return dispatch((0, _actions.addComponent)(component));
		},
		removeComponent: function removeComponent(component) {
			return dispatch((0, _actions.removeComponent)(component));
		},
		setStreaming: function setStreaming(component, stream) {
			return dispatch((0, _actions.setStreaming)(component, stream));
		},
		watchComponent: function watchComponent(component, react) {
			return dispatch((0, _actions.watchComponent)(component, react));
		},
		setQueryOptions: function setQueryOptions(component, props, execute) {
			return dispatch((0, _actions.setQueryOptions)(component, props, execute));
		},
		setQueryListener: function setQueryListener(component, onQueryChange, beforeQueryChange) {
			return dispatch((0, _actions.setQueryListener)(component, onQueryChange, beforeQueryChange));
		},
		updateQuery: function updateQuery(updateQueryObject) {
			return dispatch((0, _actions.updateQuery)(updateQueryObject));
		},
		loadMore: function loadMore(component, options, append) {
			return dispatch((0, _actions.loadMore)(component, options, append));
		},
		setMapData: function setMapData(component, geoQuery, persistMapQuery) {
			var forceExecute = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
			var meta = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
			return dispatch((0, _actions.setMapData)(component, geoQuery, persistMapQuery, forceExecute, meta));
		},
		setDefaultQuery: function setDefaultQuery(component, query) {
			return dispatch((0, _actions.setDefaultQuery)(component, query));
		},
		setComponentProps: function setComponentProps(component, options, componentType) {
			return dispatch((0, _actions.setComponentProps)(component, options, componentType));
		},
		updateComponentProps: function updateComponentProps(component, options) {
			return dispatch((0, _actions.updateComponentProps)(component, options));
		},
		triggerAnalytics: function triggerAnalytics(searchPosition, docId) {
			return dispatch((0, _actions.recordResultClick)(searchPosition, docId));
		},
		setPageURL: function setPageURL(component, value, label, showFilter, URLParams) {
			return dispatch((0, _actions.setValue)(component, value, label, showFilter, URLParams));
		}
	};
};

exports.default = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)(ReactiveMap);