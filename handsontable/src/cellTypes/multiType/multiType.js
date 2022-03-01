import { MultiEditor } from '../../editors/multiEditor';
import { autocompleteRenderer } from '../../renderers/autocompleteRenderer';
import { autocompleteValidator } from '../../validators/autocompleteValidator';

export const CELL_TYPE = 'multi';
export const MultiCellType = {
  CELL_TYPE,
  editor: MultiEditor,
  renderer: autocompleteRenderer,
  // validator: autocompleteValidator,
};
