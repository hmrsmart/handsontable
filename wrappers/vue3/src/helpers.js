"use strict";
exports.__esModule = true;
var handsontable_1 = require("handsontable");
var unassignedPropSymbol = Symbol('unassigned');
var bulkComponentContainer = null;
/**
 * Message for the warning thrown if the Handsontable instance has been destroyed.
 */
exports.HOT_DESTROYED_WARNING = 'The Handsontable instance bound to this component was destroyed and cannot be' +
    ' used properly.';
/**
 * Rewrite the settings object passed to the watchers to be a clean array/object prepared to use within Handsontable config.
 *
 * @param {*} observerSettings Watcher object containing the changed data.
 * @returns {Object|Array}
 */
function rewriteSettings(observerSettings) {
    var settingsType = Object.prototype.toString.call(observerSettings);
    var settings = null;
    var type = {};
    if (settingsType === '[object Array]') {
        settings = [];
        type.array = true;
    }
    else if (settingsType === '[object Object]') {
        settings = {};
        type.object = true;
    }
    if (type.array || type.object) {
        for (var p in observerSettings) {
            if (observerSettings.hasOwnProperty(p)) {
                settings[p] = observerSettings[p];
            }
        }
    }
    else {
        settings = observerSettings;
    }
    return settings;
}
exports.rewriteSettings = rewriteSettings;
/**
 * Private method to ensure the table is not calling `updateSettings` after editing cells.
 * @private
 */
function preventInternalEditWatch(component) {
    if (component.hotInstance) {
        component.hotInstance.addHook('beforeChange', function () {
            component.__internalEdit = true;
        });
        component.hotInstance.addHook('beforeCreateRow', function () {
            component.__internalEdit = true;
        });
        component.hotInstance.addHook('beforeCreateCol', function () {
            component.__internalEdit = true;
        });
        component.hotInstance.addHook('beforeRemoveRow', function () {
            component.__internalEdit = true;
        });
        component.hotInstance.addHook('beforeRemoveCol', function () {
            component.__internalEdit = true;
        });
    }
}
exports.preventInternalEditWatch = preventInternalEditWatch;
/**
 * Generate an object containing all the available Handsontable properties and plugin hooks.
 *
 * @param {String} source Source for the factory (either 'HotTable' or 'HotColumn').
 * @returns {Object}
 */
function propFactory(source) {
    var registeredHooks = handsontable_1["default"].hooks.getRegistered();
    var propSchema = {};
    Object.assign(propSchema, handsontable_1["default"].DefaultSettings);
    for (var prop in propSchema) {
        propSchema[prop] = {
            "default": unassignedPropSymbol
        };
    }
    for (var i = 0; i < registeredHooks.length; i++) {
        propSchema[registeredHooks[i]] = {
            "default": unassignedPropSymbol
        };
    }
    propSchema.settings = {
        "default": unassignedPropSymbol
    };
    if (source === 'HotTable') {
        propSchema.id = {
            type: String,
            "default": 'hot-' + Math.random().toString(36).substring(5)
        };
        propSchema.wrapperRendererCacheSize = {
            type: Number,
            "default": 3000
        };
    }
    return propSchema;
}
exports.propFactory = propFactory;
/**
 * Filter out all of the unassigned props, and return only the one passed to the component.
 *
 * @param {Object} props Object containing all the possible props.
 * @returns {Object} Object containing only used props.
 */
function filterPassedProps(props) {
    var filteredProps = {};
    var columnSettingsProp = props['settings'];
    if (columnSettingsProp !== unassignedPropSymbol) {
        for (var propName in columnSettingsProp) {
            if (columnSettingsProp.hasOwnProperty(propName) && columnSettingsProp[propName] !== unassignedPropSymbol) {
                filteredProps[propName] = columnSettingsProp[propName];
            }
        }
    }
    for (var propName in props) {
        if (props.hasOwnProperty(propName) && propName !== 'settings' && props[propName] !== unassignedPropSymbol) {
            filteredProps[propName] = props[propName];
        }
    }
    return filteredProps;
}
exports.filterPassedProps = filterPassedProps;
/**
 * Prepare the settings object to be used as the settings for Handsontable, based on the props provided to the component.
 *
 * @param {HotTableProps} props The props passed to the component.
 * @param {Handsontable.GridSettings} currentSettings The current Handsontable settings.
 * @returns {Handsontable.GridSettings} An object containing the properties, ready to be used within Handsontable.
 */
function prepareSettings(props, currentSettings) {
    var assignedProps = filterPassedProps(props);
    var hotSettingsInProps = props.settings ? props.settings : assignedProps;
    var additionalHotSettingsInProps = props.settings ? assignedProps : null;
    var newSettings = {};
    for (var key in hotSettingsInProps) {
        if (hotSettingsInProps.hasOwnProperty(key) &&
            hotSettingsInProps[key] !== void 0 &&
            ((currentSettings && key !== 'data') ? !simpleEqual(currentSettings[key], hotSettingsInProps[key]) : true)) {
            newSettings[key] = hotSettingsInProps[key];
        }
    }
    for (var key in additionalHotSettingsInProps) {
        if (additionalHotSettingsInProps.hasOwnProperty(key) &&
            key !== 'id' &&
            key !== 'settings' &&
            key !== 'wrapperRendererCacheSize' &&
            additionalHotSettingsInProps[key] !== void 0 &&
            ((currentSettings && key !== 'data') ? !simpleEqual(currentSettings[key], additionalHotSettingsInProps[key]) : true)) {
            newSettings[key] = additionalHotSettingsInProps[key];
        }
    }
    return newSettings;
}
exports.prepareSettings = prepareSettings;
/**
 * Get the VNode element with the provided type attribute from the component slots.
 *
 * @param {Array} componentSlots Array of slots from a component.
 * @param {String} type Type of the child component. Either `hot-renderer` or `hot-editor`.
 * @returns {Object|null} The VNode of the child component (or `null` when nothing's found).
 */
function findVNodeByType(componentSlots, type) {
    var componentVNode = null;
    componentSlots.every(function (slot, index) {
        // console.log(slot)
        if (slot.props && slot.props.attrs && slot.props.attrs[type] !== void 0) {
            componentVNode = slot;
            return false;
        }
        return true;
    });
    return componentVNode;
}
exports.findVNodeByType = findVNodeByType;
/**
 * Get all `hot-column` component instances from the provided children array.
 *
 * @param {Array} children Array of children from a component.
 * @returns {Array} Array of `hot-column` instances.
 */
function getHotColumnComponents(children) {
    return children.filter(function (child) { return child.type && child.type.name === 'HotColumn'; });
    // return children.filter((child) => child.$options && child.$options.name === 'HotColumn');
}
exports.getHotColumnComponents = getHotColumnComponents;
/**
 * Create an instance of the Vue Component based on the provided VNode.
 *
 * @param {Object} vNode VNode element to be turned into a component instance.
 * @param {Object} parent Instance of the component to be marked as a parent of the newly created instance.
 * @param {Object} props Props to be passed to the new instance.
 * @param {Object} data Data to be passed to the new instance.
 */
function createVueComponent(vNode, parent, props, data) {
    var ownerDocument = parent.$el ? parent.$el.ownerDocument : document;
    var settings = {
        propsData: props,
        parent: parent,
        data: data
    };
    if (!bulkComponentContainer) {
        bulkComponentContainer = ownerDocument.createElement('DIV');
        bulkComponentContainer.id = 'vueHotComponents';
        ownerDocument.body.appendChild(bulkComponentContainer);
    }
    var componentContainer = ownerDocument.createElement('DIV');
    bulkComponentContainer.appendChild(componentContainer);
    return (new vNode.componentOptions.Ctor(settings)).$mount(componentContainer);
}
exports.createVueComponent = createVueComponent;
/**
 * Compare two objects using `JSON.stringify`.
 * *Note: * As it's using the stringify function to compare objects, the property order in both objects is
 * important. It will return `false` for the same objects, if they're defined in a different order.
 *
 * @param {object} objectA First object to compare.
 * @param {object} objectB Second object to compare.
 * @returns {boolean} `true` if they're the same, `false` otherwise.
 */
function simpleEqual(objectA, objectB) {
    return JSON.stringify(objectA) === JSON.stringify(objectB);
}
