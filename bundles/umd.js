import '../src/css/bootstrap.css';
import '../src/3rdparty/walkontable/css/walkontable.css';
import '../src/css/handsontable.css';
import '../src/css/mobile.handsontable.css';

import { getRegisteredEditorNames, registerEditor, getEditor } from '../src/editors';
import { getRegisteredRendererNames, getRenderer, registerRenderer } from '../src/renderers';
import { getRegisteredValidatorNames, getValidator, registerValidator } from '../src/validators';
import { getRegisteredCellTypeNames, getCellType, registerCellType } from '../src/cellTypes';

import Core from '../src/core';
import jQueryWrapper from '../src/helpers/wrappers/jquery';
import EventManager, { getListenersCounter } from '../src/eventManager';
import { getRegisteredMapsCounter } from '../src/translations/mapCollection';
import Hooks from '../src/pluginHooks';
import GhostTable from '../src/utils/ghostTable';
import * as parseTableHelpers from '../src/utils/parseTable';
import * as arrayHelpers from '../src/helpers/array';
import * as browserHelpers from '../src/helpers/browser';
import * as dataHelpers from '../src/helpers/data';
import * as dateHelpers from '../src/helpers/date';
import * as featureHelpers from '../src/helpers/feature';
import * as functionHelpers from '../src/helpers/function';
import * as mixedHelpers from '../src/helpers/mixed';
import * as numberHelpers from '../src/helpers/number';
import * as objectHelpers from '../src/helpers/object';
import * as stringHelpers from '../src/helpers/string';
import * as unicodeHelpers from '../src/helpers/unicode';
import * as domHelpers from '../src/helpers/dom/element';
import * as domEventHelpers from '../src/helpers/dom/event';
import * as plugins from '../src/plugins/index';
import { registerPlugin } from '../src/plugins';
import { metaSchemaFactory } from '../src/dataMap/index';
import { rootInstanceSymbol } from '../src/utils/rootInstance';
import { getTranslatedPhrase } from '../src/i18n';
import * as constants from '../src/i18n/constants';

import {
  registerLanguageDictionary,
  getLanguagesDictionaries,
  getLanguageDictionary
} from '../src/i18n/dictionariesManager';

/**
 * @param {HTMLElement} rootElement The element to which the Handsontable instance is injected.
 * @param {object} userSettings The user defined options.
 * @returns {Core}
 */
function Handsontable(rootElement, userSettings) {
  const instance = new Core(rootElement, userSettings || {}, rootInstanceSymbol);

  instance.init();

  return instance;
}

jQueryWrapper(Handsontable);

Handsontable.Core = function(rootElement, userSettings = {}) {
  return new Core(rootElement, userSettings, rootInstanceSymbol);
};
Handsontable.DefaultSettings = metaSchemaFactory();
Handsontable.EventManager = EventManager;
Handsontable._getListenersCounter = getListenersCounter; // For MemoryLeak tests
Handsontable._getRegisteredMapsCounter = getRegisteredMapsCounter; // For MemoryLeak tests

Handsontable.packageName = 'handsontable';
Handsontable.buildDate = process.env.HOT_BUILD_DATE;
Handsontable.version = process.env.HOT_VERSION;

// Export Hooks singleton
Handsontable.hooks = Hooks.getSingleton();

// TODO: Remove this exports after rewrite tests about this module
Handsontable.__GhostTable = GhostTable;
//

// Export all helpers to the Handsontable object
const HELPERS = [
  arrayHelpers,
  browserHelpers,
  dataHelpers,
  dateHelpers,
  featureHelpers,
  functionHelpers,
  mixedHelpers,
  numberHelpers,
  objectHelpers,
  stringHelpers,
  unicodeHelpers,
  parseTableHelpers,
];
const DOM = [
  domHelpers,
  domEventHelpers,
];

Handsontable.helper = {};
Handsontable.dom = {};

// Fill general helpers.
arrayHelpers.arrayEach(HELPERS, (helper) => {
  arrayHelpers.arrayEach(Object.getOwnPropertyNames(helper), (key) => {
    if (key.charAt(0) !== '_') {
      Handsontable.helper[key] = helper[key];
    }
  });
});

// Fill DOM helpers.
arrayHelpers.arrayEach(DOM, (helper) => {
  arrayHelpers.arrayEach(Object.getOwnPropertyNames(helper), (key) => {
    if (key.charAt(0) !== '_') {
      Handsontable.dom[key] = helper[key];
    }
  });
});

// Export cell types.
Handsontable.cellTypes = {};

arrayHelpers.arrayEach(getRegisteredCellTypeNames(), (cellTypeName) => {
  Handsontable.cellTypes[cellTypeName] = getCellType(cellTypeName);
});

Handsontable.cellTypes.registerCellType = registerCellType;
Handsontable.cellTypes.getCellType = getCellType;

// Export all registered editors from the Handsontable.
Handsontable.editors = {};

arrayHelpers.arrayEach(getRegisteredEditorNames(), (editorName) => {
  Handsontable.editors[`${stringHelpers.toUpperCaseFirst(editorName)}Editor`] = getEditor(editorName);
});

Handsontable.editors.registerEditor = registerEditor;
Handsontable.editors.getEditor = getEditor;

// Export all registered renderers from the Handsontable.
Handsontable.renderers = {};

arrayHelpers.arrayEach(getRegisteredRendererNames(), (rendererName) => {
  const renderer = getRenderer(rendererName);

  if (rendererName === 'base') {
    Handsontable.renderers.cellDecorator = renderer;
  }
  Handsontable.renderers[`${stringHelpers.toUpperCaseFirst(rendererName)}Renderer`] = renderer;
});

Handsontable.renderers.registerRenderer = registerRenderer;
Handsontable.renderers.getRenderer = getRenderer;

// Export all registered validators from the Handsontable.
Handsontable.validators = {};

arrayHelpers.arrayEach(getRegisteredValidatorNames(), (validatorName) => {
  Handsontable.validators[`${stringHelpers.toUpperCaseFirst(validatorName)}Validator`] = getValidator(validatorName);
});

Handsontable.validators.registerValidator = registerValidator;
Handsontable.validators.getValidator = getValidator;

// Export all registered plugins from the Handsontable.
Handsontable.plugins = {};

arrayHelpers.arrayEach(Object.getOwnPropertyNames(plugins), (pluginName) => {
  const plugin = plugins[pluginName];

  if (pluginName === 'Base') {
    Handsontable.plugins[`${pluginName}Plugin`] = plugin;
  } else {
    Handsontable.plugins[pluginName] = plugin;
  }
});

Handsontable.plugins.registerPlugin = registerPlugin;

Handsontable.languages = {};
Handsontable.languages.dictionaryKeys = constants;
Handsontable.languages.getLanguageDictionary = getLanguageDictionary;
Handsontable.languages.getLanguagesDictionaries = getLanguagesDictionaries;
Handsontable.languages.registerLanguageDictionary = registerLanguageDictionary;

// Alias to `getTranslatedPhrase` function, for more information check it API.
Handsontable.languages.getTranslatedPhrase = (...args) => getTranslatedPhrase(...args);

export default Handsontable;
