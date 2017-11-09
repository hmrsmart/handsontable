import BasePlugin from './../_base';
import {registerPlugin} from './../../plugins';
import {arrayEach} from './../../helpers/array';
import ColumnsMapper from '.././manualColumnMove/columnsMapper';
import freezeColumnItem from './contextMenuItem/freezeColumn';
import unfreezeColumnItem from './contextMenuItem/unfreezeColumn';

import './manualColumnFreeze.css';

const privatePool = new WeakMap();
/**
 * This plugin allows to manually "freeze" and "unfreeze" a column using an entry in the Context Menu.
 * You can turn it on by setting a `manualColumnFreeze` property to `true`.
 *
 * @plugin ManualColumnFreeze
 * @dependencies ManualColumnMove
 */
class ManualColumnFreeze extends BasePlugin {
  constructor(hotInstance) {
    super(hotInstance);

    privatePool.set(this, {
      moveByFreeze: false,
      afterFirstUse: false,
    });
    /**
     * Original column positions
     *
     * @type {Array}
     */
    this.frozenColumnsBasePositions = [];
    /**
     * Object containing visual row indexes mapped to data source indexes.
     *
     * @type {RowsMapper}
     */
    this.columnsMapper = new ColumnsMapper(this);
  }

  /**
   * Check if the plugin is enabled in the Handsontable settings.
   *
   * @returns {Boolean}
   */
  isEnabled() {
    return !!this.hot.getSettings().manualColumnFreeze;
  }

  /**
   * Enable plugin for this Handsontable instance.
   */
  enablePlugin() {
    if (this.enabled) {
      return;
    }

    this.addHook('afterContextMenuDefaultOptions', (options) => this.addContextMenuEntry(options));
    this.addHook('beforeColumnMove', (columns, target) => this.onBeforeColumnMove(columns, target));
    this.addHook('modifyCol', (col, source) => this.onModifyCol(col, source));
    this.addHook('unmodifyCol', (column) => this.onUnmodifyCol(column));

    this.updateColumnsMapper();

    super.enablePlugin();
  }

  /**
   * Disable plugin for this Handsontable instance.
   */
  disablePlugin() {
    let priv = privatePool.get(this);

    priv.afterFirstUse = false;
    priv.moveByFreeze = false;

    this.columnsMapper.clearMap();
    this.frozenColumnsBasePositions.length = 0;

    super.disablePlugin();
  }

  /**
   * Updates the plugin to use the latest options you have specified.
   */
  updatePlugin() {
    this.disablePlugin();
    this.enablePlugin();

    super.updatePlugin();
  }

  /**
   * Freeze the given column (add it to fixed columns).
   *
   * @param {Number} column Visual column index.
   */
  freezeColumn(column) {
    let priv = privatePool.get(this);
    let settings = this.hot.getSettings();

    if (!priv.afterFirstUse) {
      priv.afterFirstUse = true;
    }

    if (settings.fixedColumnsLeft === this.hot.countCols() || column <= settings.fixedColumnsLeft - 1) {
      return; // already fixed
    }

    priv.moveByFreeze = true;

    this.frozenColumnsBasePositions[settings.fixedColumnsLeft] = column;

    let to = settings.fixedColumnsLeft;

    settings.fixedColumnsLeft++;

    this.columnsMapper.swapIndexes(this.getLogicalColumnIndex(column), to);
  }

  /**
   * Unfreeze the given column (remove it from fixed columns and bring to it's previous position).
   *
   * @param {Number} column Visual column index.
   */
  unfreezeColumn(column) {
    let priv = privatePool.get(this);
    let settings = this.hot.getSettings();

    if (!priv.afterFirstUse) {
      priv.afterFirstUse = true;
    }

    if (settings.fixedColumnsLeft <= 0 || (column > settings.fixedColumnsLeft - 1)) {
      return; // not fixed
    }

    priv.moveByFreeze = true;

    settings.fixedColumnsLeft--;

    let to = this.frozenColumnsBasePositions[column] || this.getLogicalColumnIndex(settings.fixedColumnsLeft);

    delete this.frozenColumnsBasePositions[column];
    this.frozenColumnsBasePositions = this.frozenColumnsBasePositions.filter(Number);

    this.columnsMapper.swapIndexes(column, to, true);
  }

  /**
   * Get the logical index of the provided column.
   *
   * @private
   * @param {Number} column
   * @returns {Number}
   */
  getLogicalColumnIndex(column) {
    return this.hot.runHooks('modifyCol', column);
  }

  /**
   * This method checks arrayMap from columnsMapper and updates the columnsMapper if it's necessary.
   *
   * @private
   */
  updateColumnsMapper() {
    let countCols = this.hot.countSourceCols();
    let columnsMapperLen = this.columnsMapper._arrayMap.length;

    if (columnsMapperLen === 0) {
      this.columnsMapper.createMap(countCols || this.hot.getSettings().startCols);

    }
  }

  /**
   * Add the manualColumnFreeze context menu entries.
   *
   * @private
   * @param {Object} options Context menu options.
   */
  addContextMenuEntry(options) {
    options.items.push(
      {name: '---------'},
      freezeColumnItem(this),
      unfreezeColumnItem(this)
    );
  }

  /**
   * 'modifyCol' hook callback.
   *
   * @private
   * @param {Number} column Visual column index.
   * @returns {Number} Physical column index.
   */
  onModifyCol(column, source) {
    if (source !== this.pluginName) {
      let columnInMapper = this.columnsMapper.getValueByIndex(column);

      column = columnInMapper === null ? column : columnInMapper;
    }

    return column;
  }

  /**
   * 'unmodifyCol' hook callback.
   *
   * @private
   * @param {Number} column Physical column index.
   * @returns {Number} Visual column index.
   */
  onUnmodifyCol(column) {
    let indexInMapper = this.columnsMapper.getIndexByValue(column);

    return indexInMapper === null ? column : indexInMapper;
  }

  /**
   * Prevent moving the rows from/to fixed area.
   *
   * @private
   * @param {Array} rows
   * @param {Number} target
   */
  onBeforeColumnMove(columns, target) {
    let priv = privatePool.get(this);

    if (priv.afterFirstUse && !priv.moveByFreeze) {
      let frozenLen = this.hot.getSettings().fixedColumnsLeft;
      let disallowMoving = target < frozenLen;

      if (!disallowMoving) {
        arrayEach(columns, (value, index, array) => {
          if (value < frozenLen) {
            disallowMoving = true;
            return false;
          }
        });
      }

      if (disallowMoving) {
        return false;
      }
    }

    if (priv.moveByFreeze) {
      priv.moveByFreeze = false;
    }
  }

  /**
   * Destroy plugin instance.
   */
  destroy() {
    this.columnsMapper.destroy();
    super.destroy();
  }

}

registerPlugin('manualColumnFreeze', ManualColumnFreeze);

export default ManualColumnFreeze;
