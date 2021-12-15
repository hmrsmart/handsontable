describe('NestedRows', () => {
  const id = 'testContainer';

  beforeEach(function() {
    this.$container = $(`<div id="${id}"></div>`).appendTo('body');
  });

  afterEach(function() {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  describe('Initialization', () => {
    it('should display an error and disable the plugin, when no data was provided', () => {
      const errorSpy = spyOn(console, 'error');

      handsontable({
        nestedRows: true
      });

      expect(errorSpy).toHaveBeenCalledWith('The Nested Rows plugin requires an Array of Objects as a dataset to be' +
        ' provided. The plugin has been disabled.');
    });

    it('should display an error and disable the plugin, when an array of arrays was provided as a dataset', () => {
      const errorSpy = spyOn(console, 'error');

      handsontable({
        data: Handsontable.helper.createSpreadsheetData(3, 3),
        nestedRows: true
      });

      expect(errorSpy).toHaveBeenCalledWith('The Nested Rows plugin requires an Array of Objects as a dataset to be' +
        ' provided. The plugin has been disabled.');
    });

    it('should prevent enabling the plugin after the updateSettings call when it was automatically disabled by ' +
       'passing the wrong dataset', () => {
      const errorSpy = spyOn(console, 'error');

      handsontable({
        data: Handsontable.helper.createSpreadsheetData(3, 3),
        nestedRows: true
      });

      expect(errorSpy).toHaveBeenCalledWith('The Nested Rows plugin requires an Array of Objects as a dataset to be' +
        ' provided. The plugin has been disabled.');

      updateSettings({});

      expect(getSettings().nestedRows).toBe(false);
      expect(getPlugin('nestedRows').enabled).toBe(false);
    });
  });
});
