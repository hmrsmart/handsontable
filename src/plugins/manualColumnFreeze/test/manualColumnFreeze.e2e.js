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

  describe('freezeColumn', () => {
    it('should increase fixedColumnsLeft setting', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        manualColumnFreeze: true
      });
      var plugin = hot.getPlugin('manualColumnFreeze');
      plugin.freezeColumn(4);

      expect(hot.getSettings().fixedColumnsLeft).toEqual(1);
    });

    it('should freeze (make fixed) the column provided as an argument', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        manualColumnFreeze: true
      });

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
        fixedColumnsLeft: 1
      });
      var plugin = hot.getPlugin('manualColumnFreeze');

      plugin.unfreezeColumn(0);
      expect(hot.getSettings().fixedColumnsLeft).toEqual(0);
    });

    it('should unfreeze (make non-fixed) the column provided as an argument', () => {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(10, 10),
        manualColumnFreeze: true,
        fixedColumnsLeft: 3
      });

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
