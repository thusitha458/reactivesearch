'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _core = require('@emotion/core');

var _downshift = require('downshift');

var _downshift2 = _interopRequireDefault(_downshift);

var _emotionTheming = require('emotion-theming');

var _actions = require('@appbaseio/reactivecore/lib/actions');

var _helper = require('@appbaseio/reactivecore/lib/utils/helper');

var _Slider = require('rheostat/lib/Slider');

var _Slider2 = _interopRequireDefault(_Slider);

var _constants = require('@appbaseio/reactivecore/lib/utils/constants');

var _types = require('@appbaseio/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _Title = require('@appbaseio/reactivesearch/lib/styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Input = require('@appbaseio/reactivesearch/lib/styles/Input');

var _Input2 = _interopRequireDefault(_Input);

var _InputIcon = require('@appbaseio/reactivesearch/lib/styles/InputIcon');

var _InputIcon2 = _interopRequireDefault(_InputIcon);

var _SearchSvg = require('@appbaseio/reactivesearch/lib/components/shared/SearchSvg');

var _SearchSvg2 = _interopRequireDefault(_SearchSvg);

var _Slider3 = require('@appbaseio/reactivesearch/lib/styles/Slider');

var _Slider4 = _interopRequireDefault(_Slider3);

var _RangeLabel = require('@appbaseio/reactivesearch/lib/components/range/addons/RangeLabel');

var _RangeLabel2 = _interopRequireDefault(_RangeLabel);

var _SliderHandle = require('@appbaseio/reactivesearch/lib/components/range/addons/SliderHandle');

var _SliderHandle2 = _interopRequireDefault(_SliderHandle);

var _Label = require('@appbaseio/reactivesearch/lib/styles/Label');

var _utils = require('@appbaseio/reactivesearch/lib/utils');

var _GeoCode2 = require('./GeoCode');

var _GeoCode3 = _interopRequireDefault(_GeoCode2);

var _utils2 = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** @jsx jsx */


var GeoDistanceSlider = function (_GeoCode) {
	_inherits(GeoDistanceSlider, _GeoCode);

	function GeoDistanceSlider(props) {
		_classCallCheck(this, GeoDistanceSlider);

		var _this = _possibleConstructorReturn(this, _GeoCode.call(this, props));

		_initialiseProps.call(_this);

		_this.type = 'geo_distance';
		_this.coordinates = null;
		_this.autocompleteService = null;

		if (props.geocoder) {
			_this.geocoder = props.geocoder;
		} else if ((0, _utils2.hasGoogleMap)()) {
			_this.geocoder = new window.google.maps.Geocoder();
		}

		if (props.autoLocation) {
			_this.getUserLocation();
		}
		props.setQueryListener(props.componentId, props.onQueryChange, null);

		// Update props in store
		props.setComponentProps(props.componentId, props, _constants.componentTypes.geoDistanceSlider);
		props.setComponentProps(_this.internalComponent, props, _constants.componentTypes.geoDistanceSlider);

		props.addComponent(props.componentId);
		_this.setReact(props);

		var currentLocation = null;
		var currentDistance = props.range.start || null;

		if (props.selectedValue) {
			currentLocation = props.selectedValue.location || null;
			currentDistance = props.selectedValue.distance || null;
		} else if (props.value) {
			currentLocation = props.value.location || null;
			currentDistance = props.value.distance || null;
		} else if (props.defaultValue) {
			currentLocation = props.defaultValue.location || null;
			currentDistance = props.defaultValue.distance || null;
		}

		_this.state = {
			currentLocation: currentLocation,
			currentDistance: currentDistance,
			userLocation: null,
			suggestions: [],
			isOpen: false
		};

		var value = {
			coordinates: _this.coordinates,
			distance: currentDistance
		};
		// Set custom and default queries in store
		(0, _helper.updateCustomQuery)(props.componentId, props, value);
		(0, _helper.updateDefaultQuery)(props.componentId, props, value);

		_this.getCoordinates(currentLocation, function () {
			if (currentDistance) {
				_this.setDistance(currentDistance);
			}
		});
		return _this;
	}

	GeoDistanceSlider.prototype.componentDidMount = function componentDidMount() {
		if ((0, _utils2.hasGoogleMap)()) {
			this.autocompleteService = new window.google.maps.places.AutocompleteService();
		}
	};

	GeoDistanceSlider.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkSomePropChange)(this.props, prevProps, (0, _utils.getValidPropsKeys)(this.props), function () {
			_this2.props.updateComponentProps(_this2.props.componentId, _this2.props, _constants.componentTypes.geoDistanceSlider);
			_this2.props.updateComponentProps(_this2.internalComponent, _this2.props, _constants.componentTypes.geoDistanceSlider);
		});

		(0, _helper.checkPropChange)(this.props.react, prevProps.react, function () {
			return _this2.setReact(prevProps);
		});

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
			_this2.updateQuery(_this2.state.currentDistance, _this2.props);
		});

		if (this.props.value && !(0, _helper.isEqual)(this.props.value, prevProps.value)) {
			this.setValues(this.props.value);
		} else if (this.props.selectedValue && this.props.selectedValue.distance && this.props.selectedValue.location && !(0, _helper.isEqual)(this.state.currentLocation, this.props.selectedValue.location) && !(0, _helper.isEqual)(this.props.selectedValue, prevProps.selectedValue)) {
			var _props = this.props,
			    onChange = _props.onChange,
			    value = _props.value;

			if (value === undefined) {
				this.setValues(this.props.selectedValue);
			} else if (onChange) {
				onChange(this.props.selectedValue);
			}
		} else if (!(0, _helper.isEqual)(this.props.selectedValue, prevProps.selectedValue) && !this.props.selectedValue) {
			var _props2 = this.props,
			    _value = _props2.value,
			    _onChange = _props2.onChange;

			if (_value === undefined) {
				// eslint-disable-next-line
				this.setState({
					currentLocation: null,
					currentDistance: null
				}, function () {
					_this2.updateQuery(null);
				});
			} else if (_onChange) {
				_onChange({
					location: null,
					distance: null
				});
			}
		}
	};

	GeoDistanceSlider.prototype.componentWillUnmount = function componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	};

	GeoDistanceSlider.prototype.setReact = function setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	};

	GeoDistanceSlider.prototype.render = function render() {
		var _this3 = this;

		return (0, _core.jsx)(
			_Slider4.default,
			{ primary: true, style: this.props.style, className: this.props.className },
			this.props.title && (0, _core.jsx)(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			this.renderSearchBox(),
			(0, _core.jsx)(_Slider2.default, {
				min: this.props.range.start,
				max: this.props.range.end,
				values: [this.state.currentDistance],
				onChange: this.handleSlider,
				className: (0, _helper.getClassName)(this.props.innerClass, 'slider'),
				handle: function handle(_ref) {
					var className = _ref.className,
					    style = _ref.style,
					    passProps = _objectWithoutProperties(_ref, ['className', 'style']);

					return (0, _core.jsx)(_SliderHandle2.default, _extends({
						style: style,
						className: className
					}, passProps, {
						renderTooltipData: _this3.props.renderTooltipData,
						tooltipTrigger: _this3.props.tooltipTrigger
					}));
				}
			}),
			this.props.rangeLabels ? (0, _core.jsx)(
				'div',
				{ css: _Label.rangeLabelsContainer },
				(0, _core.jsx)(
					_RangeLabel2.default,
					{
						align: 'left',
						className: (0, _helper.getClassName)(this.props.innerClass, 'label') || null
					},
					this.props.rangeLabels.start
				),
				(0, _core.jsx)(
					_RangeLabel2.default,
					{
						align: 'right',
						className: (0, _helper.getClassName)(this.props.innerClass, 'label') || null
					},
					this.props.rangeLabels.end
				)
			) : null
		);
	};

	return GeoDistanceSlider;
}(_GeoCode3.default);

var _initialiseProps = function _initialiseProps() {
	var _this4 = this;

	this.setValues = function (selected) {
		_this4.setState({
			currentLocation: selected.location,
			currentDistance: selected.distance
		});
		_this4.getCoordinates(selected.location, function () {
			_this4.setDistance(selected.distance);
		});
	};

	this.defaultQuery = function (coordinates, distance, props) {
		var query = null;
		if (coordinates && distance) {
			var _this4$type, _query;

			query = (_query = {}, _query[_this4.type] = (_this4$type = {
				distance: '' + distance + props.unit
			}, _this4$type[props.dataField] = coordinates, _this4$type), _query);
		}

		if (query && props.nestedField) {
			return {
				query: {
					nested: {
						path: props.nestedField,
						query: query
					}
				}
			};
		}

		return query;
	};

	this.setLocation = function (currentValue) {
		var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this4.props;

		var performUpdate = function performUpdate() {
			_this4.setState({
				currentLocation: currentValue.value,
				isOpen: false
			}, function () {
				_this4.getCoordinates(currentValue.value, function () {
					if (_this4.state.currentDistance) {
						_this4.updateQuery(_this4.state.currentDistance);
						if (props.onValueChange) {
							props.onValueChange({
								distance: _this4.state.currentDistance,
								location: currentValue.value
							});
						}
					}
				});
			});
		};

		(0, _helper.checkValueChange)(props.componentId, { distance: _this4.state.currentDistance, location: currentValue.value }, props.beforeValueChange, performUpdate);
	};

	this.setDistance = function (currentDistance) {
		_this4.setState({
			currentDistance: currentDistance
		}, function () {
			if (_this4.state.currentLocation) {
				_this4.updateQuery(currentDistance, _this4.props);
			}
		});
	};

	this.updateQuery = function (distance) {
		var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this4.props;
		var componentId = props.componentId,
		    customQuery = props.customQuery,
		    filterLabel = props.filterLabel,
		    showFilter = props.showFilter,
		    URLParams = props.URLParams;

		var value = null;
		if (distance && _this4.state.currentLocation) {
			value = {
				distance: distance,
				location: _this4.state.currentLocation
				// unit: props.unit,
			};
		}
		var query = _this4.defaultQuery(_this4.coordinates, distance, props);
		if (customQuery) {
			var customQueryTobeSet = customQuery(_this4.coordinates, distance, props);
			if (customQueryTobeSet.query) {
				query = customQueryTobeSet.query;
			}
			props.setQueryOptions(_this4.props.componentId, (0, _helper.getOptionsFromQuery)(customQueryTobeSet));
		}
		props.updateQuery({
			componentId: componentId,
			query: query,
			value: value,
			label: filterLabel,
			showFilter: showFilter,
			URLParams: URLParams,
			meta: {
				coordinates: _this4.coordinates,
				distance: distance
			}
		});
	};

	this.renderIcon = function () {
		if (_this4.props.showIcon) {
			return _this4.props.icon || (0, _core.jsx)(_SearchSvg2.default, null);
		}
		return null;
	};

	this.onInputChange = function (e) {
		var value = e.target.value;
		var _props3 = _this4.props,
		    valueProp = _props3.value,
		    onChange = _props3.onChange;

		if (valueProp === undefined) {
			_this4.setState({
				currentLocation: value
			});
		} else if (onChange) {
			onChange({ location: value, distance: _this4.state.currentDistance });
		}
		if (value.trim() && (0, _utils2.hasGoogleMap)()) {
			if (!_this4.autocompleteService) {
				_this4.autocompleteService = new window.google.maps.places.AutocompleteService();
			}

			var restrictedCountries = _this4.props.countries || [];

			_this4.autocompleteService.getPlacePredictions(_extends({
				input: value,
				componentRestrictions: { country: restrictedCountries }
			}, _this4.props.serviceOptions), function (res) {
				var suggestionsList = res && res.map(function (place) {
					return {
						label: place.description,
						value: place.description
					};
				}) || [];

				_this4.setState({
					suggestions: suggestionsList
				});
			});
		} else {
			_this4.setState({
				suggestions: []
			});
		}
	};

	this.handleFocus = function (event) {
		_this4.setState({
			isOpen: true
		});
		if (_this4.props.onFocus) {
			_this4.props.onFocus(event);
		}
	};

	this.handleOuterClick = function () {
		var _props4 = _this4.props,
		    value = _props4.value,
		    onChange = _props4.onChange;

		if (value === undefined) {
			_this4.setLocation({ value: _this4.state.currentLocation });
		} else if (onChange) {
			onChange({
				location: _this4.state.currentLocation,
				distance: _this4.state.currentDistance
			});
		}
	};

	this.handleStateChange = function (changes) {
		var isOpen = changes.isOpen,
		    type = changes.type;

		if (type === _downshift2.default.stateChangeTypes.mouseUp) {
			_this4.setState({
				isOpen: isOpen
			});
		}
	};

	this.handleLocation = function (data) {
		var _props5 = _this4.props,
		    value = _props5.value,
		    onChange = _props5.onChange;

		if (value === undefined) {
			_this4.setLocation(data);
		} else if (onChange) {
			onChange({ location: data.value, distance: _this4.state.currentDistance });
		}
	};

	this.renderSearchBox = function () {
		var suggestionsList = [].concat(_this4.state.suggestions);
		var _props6 = _this4.props,
		    theme = _props6.theme,
		    themePreset = _props6.themePreset;


		if (_this4.state.userLocation) {
			suggestionsList = [{
				label: 'Use my current location',
				value: _this4.state.userLocation
			}].concat(_this4.state.suggestions);
		}

		return (0, _core.jsx)(_downshift2.default, {
			onChange: _this4.handleLocation,
			onOuterClick: _this4.handleOuterClick,
			onStateChange: _this4.handleStateChange,
			isOpen: _this4.state.isOpen,
			itemToString: function itemToString(i) {
				return i;
			},
			render: function render(_ref2) {
				var getRootProps = _ref2.getRootProps,
				    getInputProps = _ref2.getInputProps,
				    getItemProps = _ref2.getItemProps,
				    isOpen = _ref2.isOpen,
				    highlightedIndex = _ref2.highlightedIndex;
				return (0, _core.jsx)(
					'div',
					getRootProps({ css: _Input.suggestionsContainer }, { suppressRefError: true }),
					(0, _core.jsx)(_Input2.default, _extends({
						showIcon: _this4.props.showIcon,
						iconPosition: _this4.props.iconPosition,
						innerRef: _this4.props.innerRef
					}, getInputProps({
						className: (0, _helper.getClassName)(_this4.props.innerClass, 'input'),
						placeholder: _this4.props.placeholder,
						value: _this4.state.currentLocation || '',
						onChange: _this4.onInputChange,
						onBlur: _this4.props.onBlur,
						onFocus: _this4.handleFocus,
						onKeyPress: _this4.props.onKeyPress,
						onKeyDown: _this4.handleKeyDown,
						onKeyUp: _this4.props.onKeyUp
					}), {
						themePreset: themePreset
					})),
					(0, _core.jsx)(
						_InputIcon2.default,
						{ iconPosition: _this4.props.iconPosition },
						_this4.renderIcon()
					),
					isOpen && _this4.state.suggestions.length ? (0, _core.jsx)(
						'ul',
						{
							css: (0, _Input.suggestions)(themePreset, theme),
							className: (0, _helper.getClassName)(_this4.props.innerClass, 'list')
						},
						suggestionsList.slice(0, 11).map(function (item, index) {
							return (0, _core.jsx)(
								'li',
								_extends({}, getItemProps({ item: item }), {
									key: item.label,
									style: {
										backgroundColor: highlightedIndex === index ? '#eee' : '#fff'
									}
								}),
								typeof item.label === 'string' ? (0, _core.jsx)('div', {
									className: 'trim',
									dangerouslySetInnerHTML: {
										__html: item.label
									}
								}) : item.label
							);
						})
					) : null
				);
			}
		});
	};

	this.handleSlider = function (_ref3) {
		var values = _ref3.values;
		var _props7 = _this4.props,
		    value = _props7.value,
		    onChange = _props7.onChange;

		if (value === undefined) {
			if (values[0] !== _this4.state.currentDistance) {
				_this4.setDistance(values[0]);
			}
		} else if (onChange) {
			// As rheostat do not follow controlled behavior we need to force update the component
			_this4.forceUpdate();
			onChange({ distance: values[0], location: _this4.state.currentLocation });
		}
	};
};

GeoDistanceSlider.propTypes = {
	addComponent: _types2.default.funcRequired,
	mapKey: _types2.default.stringRequired,
	removeComponent: _types2.default.funcRequired,
	selectedValue: _types2.default.selectedValue,
	setQueryListener: _types2.default.funcRequired,
	themePreset: _types2.default.themePreset,
	updateQuery: _types2.default.funcRequired,
	watchComponent: _types2.default.funcRequired,
	setComponentProps: _types2.default.funcRequired,
	setCustomQuery: _types2.default.funcRequired,
	updateComponentProps: _types2.default.funcRequired,
	// component props
	autoLocation: _types2.default.bool,
	beforeValueChange: _types2.default.func,
	className: _types2.default.string,
	componentId: _types2.default.stringRequired,
	countries: _types2.default.stringArray,
	customQuery: _types2.default.func,
	data: _types2.default.data,
	dataField: _types2.default.stringRequired,
	defaultValue: _types2.default.selectedValue,
	filterLabel: _types2.default.string,
	icon: _types2.default.children,
	iconPosition: _types2.default.iconPosition,
	innerClass: _types2.default.style,
	innerRef: _types2.default.func,
	nestedField: _types2.default.string,
	onBlur: _types2.default.func,
	onChange: _types2.default.func,
	onFocus: _types2.default.func,
	onKeyDown: _types2.default.func,
	onKeyPress: _types2.default.func,
	onKeyUp: _types2.default.func,
	onQueryChange: _types2.default.func,
	onValueChange: _types2.default.func,
	placeholder: _types2.default.string,
	range: _types2.default.range,
	rangeLabels: _types2.default.rangeLabels,
	react: _types2.default.react,
	setQueryOptions: _types2.default.funcRequired,
	showFilter: _types2.default.bool,
	showIcon: _types2.default.bool,
	tooltipTrigger: _types2.default.tooltipTrigger,
	renderTooltipData: _types2.default.func,
	style: _types2.default.style,
	theme: _types2.default.style,
	title: _types2.default.title,
	value: _types2.default.selectedValue,
	unit: _types2.default.string,
	URLParams: _types2.default.bool,
	serviceOptions: _types2.default.props,
	geocoder: _types2.default.any // eslint-disable-line
};

GeoDistanceSlider.defaultProps = {
	className: null,
	placeholder: 'Select a value',
	range: {
		start: 1,
		end: 200
	},
	showFilter: true,
	tooltipTrigger: 'none',
	style: {},
	URLParams: false,
	autoLocation: true,
	unit: 'mi',
	countries: []
};

var mapStateToProps = function mapStateToProps(state, props) {
	return {
		mapKey: state.config.mapKey,
		selectedValue: state.selectedValues[props.componentId] && state.selectedValues[props.componentId].value || null,
		themePreset: state.config.themePreset
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
		updateQuery: function updateQuery(updateQueryObject) {
			return dispatch((0, _actions.updateQuery)(updateQueryObject));
		},
		watchComponent: function watchComponent(component, react) {
			return dispatch((0, _actions.watchComponent)(component, react));
		},
		setQueryListener: function setQueryListener(component, onQueryChange, beforeQueryChange) {
			return dispatch((0, _actions.setQueryListener)(component, onQueryChange, beforeQueryChange));
		},
		setQueryOptions: function setQueryOptions(component, props) {
			return dispatch((0, _actions.setQueryOptions)(component, props));
		},
		setDefaultQuery: function setDefaultQuery(component, query) {
			return dispatch((0, _actions.setDefaultQuery)(component, query));
		},
		setCustomQuery: function setCustomQuery(component, query) {
			return dispatch((0, _actions.setCustomQuery)(component, query));
		},
		setComponentProps: function setComponentProps(component, options, componentType) {
			return dispatch((0, _actions.setComponentProps)(component, options, componentType));
		},
		updateComponentProps: function updateComponentProps(component, options) {
			return dispatch((0, _actions.updateComponentProps)(component, options));
		}
	};
};

exports.default = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)((0, _emotionTheming.withTheme)(GeoDistanceSlider));