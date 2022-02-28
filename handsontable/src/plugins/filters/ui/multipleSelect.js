import { addClass, getScrollbarWidth } from '../../../helpers/dom/element';
import { clone, extend } from '../../../helpers/object';
import { arrayFilter, arrayMap, arrayEach } from '../../../helpers/array';
import { isKey } from '../../../helpers/unicode';
import { partial } from '../../../helpers/function';
import { dataRowToChangesArray } from '../../../helpers/data';
import * as C from '../../../i18n/constants';
import { stopImmediatePropagation } from '../../../helpers/dom/event';
import BaseUI from './_base';
import InputUI from './input';
import LinkUI from './link';
import { createArrayAssertion } from '../utils';

const privatePool = new WeakMap();
const SHORTCUTS_GROUP = 'multipleSelect.itemBox';

/**
 * @private
 * @class MultipleSelectUI
 */
class MultipleSelectUI extends BaseUI {
  static get DEFAULTS() {
    return clone({
      className: 'htUIMultipleSelect',
      value: [],
    });
  }

  constructor(hotInstance, options) {
    super(hotInstance, extend(MultipleSelectUI.DEFAULTS, options));

    privatePool.set(this, {});
    /**
     * Input element.
     *
     * @type {InputUI}
     */
    this.searchInput = new InputUI(this.hot, {
      placeholder: C.FILTERS_BUTTONS_PLACEHOLDER_SEARCH,
      className: 'htUIMultipleSelectSearch'
    });
    /**
     * "Select all" UI element.
     *
     * @type {BaseUI}
     */
    this.selectAllUI = new LinkUI(this.hot, {
      textContent: C.FILTERS_BUTTONS_SELECT_ALL,
      className: 'htUISelectAll',
    });
    /**
     * "Clear" UI element.
     *
     * @type {BaseUI}
     */
    this.clearAllUI = new LinkUI(this.hot, {
      textContent: C.FILTERS_BUTTONS_CLEAR,
      className: 'htUIClearAll',
    });
    /**
     * List of available select options.
     *
     * @type {Array}
     */
    this.items = [];
    /**
     * Handsontable instance used as items list element.
     *
     * @type {Handsontable}
     */
    this.itemsBox = null;

    this.registerHooks();
  }

  /**
   * Register all necessary hooks.
   */
  registerHooks() {
    this.searchInput.addLocalHook('keydown', event => this.onInputKeyDown(event));
    this.searchInput.addLocalHook('input', event => this.onInput(event));
    this.selectAllUI.addLocalHook('click', event => this.onSelectAllClick(event));
    this.clearAllUI.addLocalHook('click', event => this.onClearAllClick(event));
  }

  /**
   * Set available options.
   *
   * @param {Array} items Array of objects with `checked` and `label` property.
   */
  setItems(items) {
    this.items = items;

    if (this.itemsBox) {
      this.itemsBox.loadData(this.items);
    }
  }

  /**
   * Set a locale for the component.
   *
   * @param {string} locale Locale used for filter actions performed on data, ie. `en-US`.
   */
  setLocale(locale) {
    this.locale = locale;
  }

  /**
   * Get a locale for the component.
   *
   * @returns {string}
   */
  getLocale() {
    return this.locale;
  }

  /**
   * Get all available options.
   *
   * @returns {Array}
   */
  getItems() {
    return [...this.items];
  }

  /**
   * Get element value.
   *
   * @returns {Array} Array of selected values.
   */
  getValue() {
    return itemsToValue(this.items);
  }

  /**
   * Check if all values listed in element are selected.
   *
   * @returns {boolean}
   */
  isSelectedAllValues() {
    return this.items.length === this.getValue().length;
  }

  /**
   * Build DOM structure.
   */
  build() {
    super.build();

    const { rootDocument } = this.hot;
    const itemsBoxWrapper = rootDocument.createElement('div');
    const selectionControl = new BaseUI(this.hot, {
      className: 'htUISelectionControls',
      children: [this.selectAllUI, this.clearAllUI],
    });

    this._element.appendChild(this.searchInput.element);
    this._element.appendChild(selectionControl.element);
    this._element.appendChild(itemsBoxWrapper);

    const hotInitializer = (wrapper) => {
      if (!this._element) {
        return;
      }
      if (this.itemsBox) {
        this.itemsBox.destroy();
      }

      addClass(wrapper, 'htUIMultipleSelectHot');
      // Construct and initialise a new Handsontable
      this.itemsBox = new this.hot.constructor(wrapper, {
        data: this.items,
        columns: [
          { data: 'checked', type: 'checkbox', label: { property: 'visualValue', position: 'after' } }
        ],
        beforeRenderer: (TD, row, col, prop, value, cellProperties) => {
          TD.title = cellProperties.instance.getDataAtRowProp(row, cellProperties.label.property);
        },
        maxCols: 1,
        autoWrapCol: true,
        height: 110,
        // Workaround for #151.
        colWidths: () => this.itemsBox.container.scrollWidth - getScrollbarWidth(rootDocument),
        copyPaste: false,
        disableVisualSelection: 'area',
        fillHandle: false,
        fragmentSelection: 'cell',
        tabMoves: { row: 1, col: 0 },
      });
      this.itemsBox.init();

      const shortcutManager = this.itemsBox.getShortcutManager();
      const gridContext = shortcutManager.getContext('grid');

      gridContext.addShortcut({
        // TODO: Is this shortcut really needed? We have one test for that case, but focus is performed programmatically.
        keys: [['Escape']],
        callback: (event) => {
          this.runLocalHooks('keydown', event, this);
        },
        group: SHORTCUTS_GROUP
      });
    };

    hotInitializer(itemsBoxWrapper);
    setTimeout(() => hotInitializer(itemsBoxWrapper), 100);
  }

  /**
   * Reset DOM structure.
   */
  reset() {
    this.searchInput.reset();
    this.selectAllUI.reset();
    this.clearAllUI.reset();
  }

  /**
   * Update DOM structure.
   */
  update() {
    if (!this.isBuilt()) {
      return;
    }

    this.itemsBox.loadData(valueToItems(this.items, this.options.value));
    super.update();
  }

  /**
   * Destroy instance.
   */
  destroy() {
    if (this.itemsBox) {
      this.itemsBox.destroy();
    }
    this.searchInput.destroy();
    this.clearAllUI.destroy();
    this.selectAllUI.destroy();

    this.searchInput = null;
    this.clearAllUI = null;
    this.selectAllUI = null;
    this.itemsBox = null;
    this.items = null;
    super.destroy();
  }

  /**
   * 'input' event listener for input element.
   *
   * @private
   * @param {Event} event DOM event.
   */
  onInput(event) {
    const value = event.target.value.toLocaleLowerCase(this.getLocale());
    let filteredItems;

    if (value === '') {
      filteredItems = [...this.items];
    } else {
      filteredItems = arrayFilter(this.items,
        item => (`${item.value}`).toLocaleLowerCase(this.getLocale()).indexOf(value) >= 0);
    }
    this.itemsBox.loadData(filteredItems);
  }

  /**
   * 'keydown' event listener for input element.
   *
   * @private
   * @param {Event} event DOM event.
   */
  onInputKeyDown(event) {
    this.runLocalHooks('keydown', event, this);

    const isKeyCode = partial(isKey, event.keyCode);

    if (isKeyCode('ARROW_DOWN|TAB') && !this.itemsBox.isListening()) {
      stopImmediatePropagation(event);
      this.itemsBox.listen();
      this.itemsBox.selectCell(0, 0);
    }
  }

  /**
   * On click listener for "Select all" link.
   *
   * @private
   * @param {DOMEvent} event The mouse event object.
   */
  onSelectAllClick(event) {
    const changes = [];

    event.preventDefault();
    arrayEach(this.itemsBox.getSourceData(), (row, rowIndex) => {
      row.checked = true;

      changes.push(dataRowToChangesArray(row, rowIndex)[0]);
    });

    this.itemsBox.setSourceDataAtCell(changes);
  }

  /**
   * On click listener for "Clear" link.
   *
   * @private
   * @param {DOMEvent} event The mouse event object.
   */
  onClearAllClick(event) {
    const changes = [];

    event.preventDefault();
    arrayEach(this.itemsBox.getSourceData(), (row, rowIndex) => {
      row.checked = false;

      changes.push(dataRowToChangesArray(row, rowIndex)[0]);
    });

    this.itemsBox.setSourceDataAtCell(changes);
  }
}

export default MultipleSelectUI;

/**
 * Pick up object items based on selected values.
 *
 * @param {Array} availableItems Base collection to compare values.
 * @param {Array} selectedValue Flat array with selected values.
 * @returns {Array}
 */
function valueToItems(availableItems, selectedValue) {
  const arrayAssertion = createArrayAssertion(selectedValue);

  return arrayMap(availableItems, (item) => {
    item.checked = arrayAssertion(item.value);

    return item;
  });
}

/**
 * Convert all checked items into flat array.
 *
 * @param {Array} availableItems Base collection.
 * @returns {Array}
 */
function itemsToValue(availableItems) {
  const items = [];

  arrayEach(availableItems, (item) => {
    if (item.checked) {
      items.push(item.value);
    }
  });

  return items;
}
