'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _core = require('@emotion/core');

var _downshift = require('downshift');

var _downshift2 = _interopRequireDefault(_downshift);

var _emotionTheming = require('emotion-theming');

var _actions = require('@appbaseio/reactivecore/lib/actions');

var _helper = require('@appbaseio/reactivecore/lib/utils/helper');

var _constants = require('@appbaseio/reactivecore/lib/utils/constants');

var _types = require('@appbaseio/reactivecore/lib/utils/types');

var _types2 = _interopRequireDefault(_types);

var _Title = require('@appbaseio/reactivesearch/lib/styles/Title');

var _Title2 = _interopRequireDefault(_Title);

var _Input = require('@appbaseio/reactivesearch/lib/styles/Input');

var _Input2 = _interopRequireDefault(_Input);

var _InputIcon = require('@appbaseio/reactivesearch/lib/styles/InputIcon');

var _InputIcon2 = _interopRequireDefault(_InputIcon);

var _Container = require('@appbaseio/reactivesearch/lib/styles/Container');

var _Container2 = _interopRequireDefault(_Container);

var _SearchSvg = require('@appbaseio/reactivesearch/lib/components/shared/SearchSvg');

var _SearchSvg2 = _interopRequireDefault(_SearchSvg);

var _Dropdown = require('@appbaseio/reactivesearch/lib/components/shared/Dropdown');

var _Dropdown2 = _interopRequireDefault(_Dropdown);

var _utils = require('@appbaseio/reactivesearch/lib/utils');

var _GeoCode2 = require('./GeoCode');

var _GeoCode3 = _interopRequireDefault(_GeoCode2);

var _utils2 = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /** @jsx jsx */


var GeoDistanceDropdown = function (_GeoCode) {
	_inherits(GeoDistanceDropdown, _GeoCode);

	function GeoDistanceDropdown(props) {
		_classCallCheck(this, GeoDistanceDropdown);

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

		var currentLocation = null;
		var currentDistance = 0;

		props.addComponent(props.componentId);
		props.setQueryListener(props.componentId, props.onQueryChange, null);

		// Update props in store
		props.setComponentProps(props.componentId, props, _constants.componentTypes.geoDistanceDropdown);
		props.setComponentProps(_this.internalComponent, props, _constants.componentTypes.geoDistanceDropdown);

		_this.setReact(props);

		if (props.value) {
			currentLocation = props.value.location;
			var selected = props.data.find(function (item) {
				return item.label === props.value.label;
			});

			currentDistance = selected.distance;
		} else if (props.selectedValue) {
			currentLocation = props.selectedValue.location;
			var _selected = props.data.find(function (item) {
				return item.label === props.selectedValue.label;
			});

			currentDistance = _selected.distance;
		} else if (props.defaultValue) {
			currentLocation = props.defaultValue.location;
			var _selected2 = props.data.find(function (item) {
				return item.label === props.defaultValue.label;
			});
			currentDistance = _selected2.distance;
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
			_this.setDistance(currentDistance);
		});
		return _this;
	}

	GeoDistanceDropdown.prototype.componentDidMount = function componentDidMount() {
		if ((0, _utils2.hasGoogleMap)()) {
			this.autocompleteService = new window.google.maps.places.AutocompleteService();
		}
	};

	GeoDistanceDropdown.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
		var _this2 = this;

		(0, _helper.checkSomePropChange)(this.props, prevProps, (0, _utils.getValidPropsKeys)(this.props), function () {
			_this2.props.updateComponentProps(_this2.props.componentId, _this2.props, _constants.componentTypes.geoDistanceDropdown);
			_this2.props.updateComponentProps(_this2.internalComponent, _this2.props, _constants.componentTypes.geoDistanceDropdown);
		});

		(0, _helper.checkPropChange)(this.props.react, prevProps.react, function () {
			return _this2.setReact(_this2.props);
		});

		(0, _helper.checkSomePropChange)(this.props, prevProps, ['dataField', 'nestedField'], function () {
			_this2.updateQuery(_this2.state.currentDistance, _this2.props);
		});

		if (this.props.value && !(0, _helper.isEqual)(this.props.value, prevProps.value)) {
			this.setValues(this.props.value, this.props);
		} else if (this.props.selectedValue && this.props.selectedValue.label && this.props.selectedValue.location && !(0, _helper.isEqual)(this.state.currentLocation, this.props.selectedValue.location) && !(0, _helper.isEqual)(this.props.selectedValue, prevProps.selectedValue)) {
			var _props = this.props,
			    value = _props.value,
			    onChange = _props.onChange;


			if (value === undefined) {
				this.setValues(this.props.selectedValue, this.props);
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
				_onChange(null);
			}
		}
	};

	GeoDistanceDropdown.prototype.componentWillUnmount = function componentWillUnmount() {
		this.props.removeComponent(this.props.componentId);
	};

	GeoDistanceDropdown.prototype.setReact = function setReact(props) {
		if (props.react) {
			props.watchComponent(props.componentId, props.react);
		}
	};

	GeoDistanceDropdown.prototype.render = function render() {
		return (0, _core.jsx)(
			_Container2.default,
			{ style: this.props.style, className: this.props.className },
			this.props.title && (0, _core.jsx)(
				_Title2.default,
				{ className: (0, _helper.getClassName)(this.props.innerClass, 'title') || null },
				this.props.title
			),
			this.renderSearchBox(),
			(0, _core.jsx)(_Dropdown2.default, {
				innerClass: this.props.innerClass,
				items: this.props.data,
				onChange: this.onDistanceChange,
				selectedItem: this.getSelectedLabel(this.state.currentDistance),
				placeholder: 'Select distance',
				keyField: 'label',
				returnsObject: true,
				themePreset: this.props.themePreset
			})
		);
	};

	return GeoDistanceDropdown;
}(_GeoCode3.default);

var _initialiseProps = function _initialiseProps() {
	var _this3 = this;

	this.setValues = function (selected, props) {
		var selectedDistance = props.data.find(function (item) {
			return item.label === selected.label;
		});
		_this3.setState({
			currentLocation: selected.location,
			currentDistance: selectedDistance.distance
		});
		_this3.getCoordinates(selected.location, function () {
			_this3.setDistance(selectedDistance.distance);
		});
	};

	this.defaultQuery = function (coordinates, distance, props) {
		var query = null;
		if (coordinates && distance) {
			var _this3$type, _query;

			query = (_query = {}, _query[_this3.type] = (_this3$type = {
				distance: '' + distance + props.unit
			}, _this3$type[props.dataField] = coordinates, _this3$type), _query);
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

	this.getSelectedLabel = function (distance) {
		return _this3.props.data.find(function (item) {
			return item.distance === distance;
		});
	};

	this.setLocation = function (currentValue) {
		var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this3.props;

		var performUpdate = function performUpdate() {
			_this3.setState({
				currentLocation: currentValue.value,
				isOpen: false
			}, function () {
				_this3.getCoordinates(currentValue.value, function () {
					if (_this3.state.currentDistance) {
						_this3.updateQuery(_this3.state.currentDistance);
						if (props.onValueChange) {
							props.onValueChange({
								label: _this3.getSelectedLabel(_this3.state.currentDistance),
								location: currentValue.value
							});
						}
					}
				});
			});
		};

		(0, _helper.checkValueChange)(props.componentId, {
			label: _this3.getSelectedLabel(_this3.state.currentDistance),
			location: currentValue.value
		}, props.beforeValueChange, performUpdate);
	};

	this.setDistance = function (currentDistance) {
		_this3.setState({
			currentDistance: currentDistance
		}, function () {
			_this3.updateQuery(currentDistance, _this3.props);
			if (_this3.props.onValueChange) {
				_this3.props.onValueChange({
					label: _this3.getSelectedLabel(currentDistance),
					location: _this3.state.currentLocation
				});
			}
		});
	};

	this.updateQuery = function (distance) {
		var props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this3.props;
		var componentId = props.componentId,
		    customQuery = props.customQuery,
		    filterLabel = props.filterLabel,
		    showFilter = props.showFilter,
		    URLParams = props.URLParams;

		var selectedDistance = _this3.getSelectedLabel(distance);
		var value = null;
		if (selectedDistance) {
			value = {
				label: selectedDistance.label,
				location: _this3.state.currentLocation
			};
		}
		var query = _this3.defaultQuery(_this3.coordinates, distance, props);
		if (customQuery) {
			var customQueryTobeSet = customQuery(_this3.coordinates, distance, props);
			if (customQueryTobeSet.query) {
				query = customQueryTobeSet.query;
			}
			props.setQueryOptions(_this3.props.componentId, (0, _helper.getOptionsFromQuery)(customQueryTobeSet));
		}
		props.updateQuery({
			componentId: componentId,
			query: query,
			value: value,
			label: filterLabel,
			showFilter: showFilter,
			URLParams: URLParams,
			meta: {
				coordinates: _this3.coordinates,
				distance: distance
			}
		});
	};

	this.renderIcon = function () {
		if (_this3.props.showIcon) {
			return _this3.props.icon || (0, _core.jsx)(_SearchSvg2.default, null);
		}
		return null;
	};

	this.onDistanceChange = function (value) {
		var _props3 = _this3.props,
		    onChange = _props3.onChange,
		    valueProp = _props3.value;

		if (valueProp === undefined) {
			_this3.setDistance(value.distance);
		} else if (onChange) {
			onChange({ label: value.label, location: _this3.state.currentLocation });
		}
	};

	this.onInputChange = function (e) {
		var value = e.target.value;
		var _props4 = _this3.props,
		    onChange = _props4.onChange,
		    propValue = _props4.value;


		if (propValue === undefined) {
			_this3.setState({
				currentLocation: value
			});
		} else if (onChange) {
			onChange({
				location: value,
				label: _this3.props.value.label
			});
		}
		if (value.trim() && (0, _utils2.hasGoogleMap)()) {
			if (!_this3.autocompleteService) {
				_this3.autocompleteService = new window.google.maps.places.AutocompleteService();
			}

			var restrictedCountries = _this3.props.countries || [];

			_this3.autocompleteService.getPlacePredictions(_extends({
				input: value,
				componentRestrictions: { country: restrictedCountries }
			}, _this3.props.serviceOptions), function (res) {
				var suggestionsList = res && res.map(function (place) {
					return {
						label: place.description,
						value: place.description
					};
				}) || [];

				_this3.setState({
					suggestions: suggestionsList
				});
			});
		} else {
			_this3.setState({
				suggestions: []
			});
		}
	};

	this.handleFocus = function (event) {
		_this3.setState({
			isOpen: true
		});
		if (_this3.props.onFocus) {
			_this3.props.onFocus(event);
		}
	};

	this.handleOuterClick = function () {
		var _props5 = _this3.props,
		    onChange = _props5.onChange,
		    value = _props5.value;


		if (value === undefined) {
			_this3.setLocation({ value: _this3.state.currentLocation });
		} else if (onChange) {
			onChange({
				location: _this3.state.currentLocation,
				label: _this3.props.value.label
			});
		}
	};

	this.handleStateChange = function (changes) {
		var isOpen = changes.isOpen,
		    type = changes.type;

		if (type === _downshift2.default.stateChangeTypes.mouseUp) {
			_this3.setState({
				isOpen: isOpen
			});
		}
	};

	this.handleLocation = function (data) {
		var _props6 = _this3.props,
		    value = _props6.value,
		    onChange = _props6.onChange;


		if (value === undefined) {
			_this3.setLocation(data);
		} else if (onChange) {
			onChange({
				location: data.value,
				label: _this3.props.value.label
			});
		}
	};

	this.renderSearchBox = function () {
		var suggestionsList = [].concat(_this3.state.suggestions);
		var _props7 = _this3.props,
		    theme = _props7.theme,
		    themePreset = _props7.themePreset;


		if (_this3.state.userLocation) {
			suggestionsList = [{
				label: 'Use my current location',
				value: _this3.state.userLocation
			}].concat(_this3.state.suggestions);
		}

		return (0, _core.jsx)(_downshift2.default, {
			onChange: _this3.handleLocation,
			onOuterClick: _this3.handleOuterClick,
			onStateChange: _this3.handleStateChange,
			isOpen: _this3.state.isOpen,
			itemToString: function itemToString(i) {
				return i;
			},
			render: function render(_ref) {
				var getRootProps = _ref.getRootProps,
				    getInputProps = _ref.getInputProps,
				    getItemProps = _ref.getItemProps,
				    isOpen = _ref.isOpen,
				    highlightedIndex = _ref.highlightedIndex;
				return (0, _core.jsx)(
					'div',
					getRootProps({ css: _Input.suggestionsContainer }, { suppressRefError: true }),
					(0, _core.jsx)(_Input2.default, _extends({
						showIcon: _this3.props.showIcon,
						iconPosition: _this3.props.iconPosition,
						innerRef: _this3.props.innerRef
					}, getInputProps({
						className: (0, _helper.getClassName)(_this3.props.innerClass, 'input'),
						placeholder: _this3.props.placeholder,
						value: _this3.state.currentLocation || '',
						onChange: _this3.onInputChange,
						onBlur: _this3.props.onBlur,
						onFocus: _this3.handleFocus,
						onKeyPress: _this3.props.onKeyPress,
						onKeyDown: _this3.handleKeyDown,
						onKeyUp: _this3.props.onKeyUp
					}), {
						themePreset: themePreset
					})),
					(0, _core.jsx)(
						_InputIcon2.default,
						{ iconPosition: _this3.props.iconPosition },
						_this3.renderIcon()
					),
					isOpen && _this3.state.suggestions.length ? (0, _core.jsx)(
						'ul',
						{
							css: (0, _Input.suggestions)(themePreset, theme),
							className: (0, _helper.getClassName)(_this3.props.innerClass, 'list')
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
};

GeoDistanceDropdown.propTypes = {
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
	react: _types2.default.react,
	setQueryOptions: _types2.default.funcRequired,
	value: _types2.default.selectedValue,
	showFilter: _types2.default.bool,
	showIcon: _types2.default.bool,
	style: _types2.default.style,
	theme: _types2.default.style,
	title: _types2.default.title,
	unit: _types2.default.string,
	URLParams: _types2.default.bool,
	serviceOptions: _types2.default.props,
	geocoder: _types2.default.any // eslint-disable-line
};

GeoDistanceDropdown.defaultProps = {
	className: null,
	placeholder: 'Select a value',
	showFilter: true,
	style: {},
	URLParams: false,
	countries: [],
	autoLocation: true,
	unit: 'mi'
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

exports.default = (0, _utils.connect)(mapStateToProps, mapDispatchtoProps)((0, _emotionTheming.withTheme)(GeoDistanceDropdown));