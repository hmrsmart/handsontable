describe('manualColumnFreeze', () => {
  var id = 'testContainer';

  beforeEach(function() {
    this.$container = $(`<div id="${id}"></div>`).appendTo('body');
  });

  afterEach(function() {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  describe('updateSettings', () => {
    it('should enable the plugin in the initial config', () => {
      const hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(4, 4),
        manualColumnFreeze: true
      });

      expect(hot.getPlugin('manualColumnFreeze').isEnabled()).toBe(true);
    });

    it('should enable the plugin using updateSettings', () => {
      const hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(4, 4)
      });

      expect(hot.getPlugin('manualColumnFreeze').isEnabled()).toBe(false);

      updateSettings({
        manualColumnFreeze: true
      });

      expect(hot.getPlugin('manualColumnFreeze').isEnabled()).toBe(true);
    });

    it('should disable the plugin using updateSettings', () => {
      const hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(4, 4),
        contextMenu: true,
        manualColumnFreeze: true
      });

      contextMenu();

      expect(hot.getPlugin('manualColumnFreeze').isEnabled()).toBe(true);

      updateSettings({
        manualColumnFreeze: false
      });

      expect(hot.getPlugin('manualColumnFreeze').isEnabled()).toBe(false);
    });

    it('should update manualColumnFreeze in context menu items by using updateSettings', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        contextMenu: true,
        manualColumnFreeze: true
      });

      contextMenu();

      var items = $('.htContextMenu tbody td');
      var actions = items.not('.htSeparator');

      expect(actions.text()).toContain('Freeze this column');

      hot.updateSettings({
        manualColumnFreeze: false
      });

      contextMenu();

      items = $('.htContextMenu tbody td');
      actions = items.not('.htSeparator');

      expect(actions.text()).not.toContain('Freeze this column');
    });

    it('should not change plugin settings when using updateSettings enabled another plugin', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        contextMenu: true,
        manualColumnFreeze: true
      });

      contextMenu();

      var plugin = hot.getPlugin('manualColumnFreeze');
      plugin.freezeColumn(4);

      expect(hot.getSettings().fixedColumnsLeft).toEqual(1);
      expect(plugin.fixedColumnsLeft).toEqual(1);

      hot.updateSettings({
        copyPaste: true
      });

      expect(hot.getSettings().fixedColumnsLeft).toEqual(1);
      expect(plugin.fixedColumnsLeft).toEqual(1);
      expect(plugin.columnsMapper.getValueByIndex(0)).toEqual(4);
    });

    it('should reset fixedColumnsLeft when disable plugin', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        contextMenu: true,
        manualColumnFreeze: true,
        fixedColumnsLeft: 3
      });

      contextMenu();

      var plugin = hot.getPlugin('manualColumnFreeze');
      plugin.freezeColumn(8);

      expect(hot.getSettings().fixedColumnsLeft).toEqual(4);
      expect(plugin.fixedColumnsLeft).toEqual(1);

      hot.updateSettings({
        manualColumnFreeze: false
      });

      expect(hot.getSettings().fixedColumnsLeft).toEqual(3);
      expect(plugin.fixedColumnsLeft).toEqual(0);
    });
  });

  describe('freezeColumn', () => {
    it('should increase fixedColumnsLeft setting', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        manualColumnFreeze: true,
        contextMenu: true
      });

      contextMenu();

      var plugin = hot.getPlugin('manualColumnFreeze');
      plugin.freezeColumn(4);

      expect(hot.getSettings().fixedColumnsLeft).toEqual(1);
    });

    it('should freeze (make fixed) the column provided as an argument', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        manualColumnFreeze: true,
        contextMenu: true
      });

      contextMenu();

      var plugin = hot.getPlugin('manualColumnFreeze');

      plugin.freezeColumn(5);

      expect(plugin.columnsMapper.getValueByIndex(0)).toEqual(5);
    });
  });

  describe('unfreezeColumn', () => {
    it('should decrease fixedColumnsLeft setting', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        manualColumnFreeze: true,
        contextMenu: true,
        fixedColumnsLeft: 1
      });

      contextMenu();

      var plugin = hot.getPlugin('manualColumnFreeze');

      plugin.unfreezeColumn(0);
      expect(hot.getSettings().fixedColumnsLeft).toEqual(0);
    });

    it('should unfreeze (make non-fixed) the column provided as an argument', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        manualColumnFreeze: true,
        contextMenu: true,
        fixedColumnsLeft: 3
      });

      contextMenu();

      var plugin = hot.getPlugin('manualColumnFreeze');

      plugin.unfreezeColumn(0);

      expect(hot.getSettings().fixedColumnsLeft).toEqual(2);
      expect(plugin.columnsMapper.getValueByIndex(0)).toEqual(1);
      expect(plugin.columnsMapper.getValueByIndex(1)).toEqual(2);
      expect(plugin.columnsMapper.getValueByIndex(2)).toEqual(0);
    });
  });

  describe('functionality', () => {

    it('should add a \'freeze this column\' context menu entry for non-fixed columns', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        manualColumnFreeze: true,
        contextMenu: true
      });

      selectCell(1, 1);
      contextMenu();

      var freezeEntry = $(hot.getPlugin('contextMenu').menu.container).find('div').filter(function() {
        return $(this).text() === 'Freeze this column';

      });

      expect(freezeEntry.size()).toEqual(1);
    });

    it('should add a \'unfreeze this column\' context menu entry for fixed columns', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        manualColumnFreeze: true,
        contextMenu: true,
        fixedColumnsLeft: 2
      });

      selectCell(1, 1);
      contextMenu();

      var freezeEntry = $(hot.getPlugin('contextMenu').menu.container).find('div').filter(function() {
        return $(this).text() === 'Unfreeze this column';

      });

      expect(freezeEntry.size()).toEqual(1);
    });

    it('should fix the desired column after clicking the \'freeze this column\' context menu entry', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        manualColumnFreeze: true,
        fixedColumnsLeft: 1,
        contextMenu: true
      });

      selectCell(1, 3);

      var dataAtCell = hot.getDataAtCell(1, 3);

      contextMenu();

      var freezeEntry = $(hot.getPlugin('contextMenu').menu.container).find('div').filter(function() {
        if ($(this).text() === 'Freeze this column') {
          return true;
        }
        return false;
      });

      expect(freezeEntry.size()).toEqual(1);
      freezeEntry.eq(0).simulate('mousedown');

      expect(hot.getSettings().fixedColumnsLeft).toEqual(2);
      expect(hot.getDataAtCell(1, 1)).toEqual(dataAtCell);

    });
  });

});
