import arrayMapper from 'handsontable/mixins/arrayMapper';

describe('arrayMapper mixin', () => {
  describe('insertItems', () => {
    it('should add items to _arrayMap to the given place', () => {
      arrayMapper._arrayMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      arrayMapper.insertItems(3);

      expect(arrayMapper._arrayMap.length).toBe(11);
      expect(arrayMapper._arrayMap[3]).toEqual(10);

      arrayMapper.insertItems(6, 5);

      expect(arrayMapper._arrayMap.length).toBe(16);
      expect(arrayMapper._arrayMap[6]).toEqual(11);
      expect(arrayMapper._arrayMap[10]).toEqual(15);
    });
  });

  describe('removeItems', () => {
    it('should remove items from _arrayMap and returns removed items', () => {
      arrayMapper._arrayMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      var removed = arrayMapper.removeItems(4);

      expect(arrayMapper._arrayMap.length).toBe(9);
      expect(removed.length).toBe(1);
      expect(removed).toContain(4);

      var removedTwo = arrayMapper.removeItems(1, 3);

      expect(arrayMapper._arrayMap.length).toBe(6);
      expect(removedTwo.length).toBe(3);
      expect(removedTwo).toContain(1);
      expect(removedTwo).toContain(2);
      expect(removedTwo).toContain(3);
      expect(removedTwo).not.toContain(0);
    });
  });

  describe('unshiftItems', () => {
    it('should remove items from _arrayMap', () => {
      arrayMapper._arrayMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      arrayMapper.unshiftItems(8);

      expect(arrayMapper._arrayMap.length).toBe(9);

      arrayMapper.unshiftItems(1, 3);

      expect(arrayMapper._arrayMap.length).toBe(6);
    });
  });

  describe('shiftItems', () => {
    it('should add items to _arrayMap', () => {
      arrayMapper._arrayMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      arrayMapper.shiftItems(8);

      expect(arrayMapper._arrayMap.length).toBe(11);

      arrayMapper.shiftItems(1, 3);

      expect(arrayMapper._arrayMap.length).toBe(14);
    });
  });

  describe('Swap indexes', () => {
    it('should swap given indexes', () => {
      arrayMapper._arrayMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      arrayMapper.swapIndexes(8, 0);
      arrayMapper.swapIndexes(3, 1);
      arrayMapper.swapIndexes(5, 2);

      expect(arrayMapper._arrayMap.length).toBe(10);
      expect(arrayMapper._arrayMap[0]).toEqual(8);
      expect(arrayMapper._arrayMap[1]).toEqual(3);
      expect(arrayMapper._arrayMap[2]).toEqual(5);
    });

    it('should return to their index', () => {
      arrayMapper._arrayMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      arrayMapper.swapIndexes(5, 0);
      arrayMapper.swapIndexes(8, 1);

      expect(arrayMapper._arrayMap[0]).toEqual(5);
      expect(arrayMapper._arrayMap[1]).toEqual(8);

      arrayMapper.swapIndexes(1, 8, true);
      arrayMapper.swapIndexes(0, 5, true);

      expect(arrayMapper._arrayMap.length).toBe(10);
      expect(arrayMapper._arrayMap[0]).toEqual(0);
      expect(arrayMapper._arrayMap[1]).toEqual(1);
      expect(arrayMapper._arrayMap[5]).toEqual(5);
      expect(arrayMapper._arrayMap[8]).toEqual(8);
    });
  });

  describe('clearMap', () => {
    it('should clear _arrayMap', () => {
      arrayMapper._arrayMap = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

      expect(arrayMapper._arrayMap.length).toBe(10);

      arrayMapper.clearMap();

      expect(arrayMapper._arrayMap.length).toBe(0);
    });
  });
});
