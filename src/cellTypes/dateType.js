import { getEditor } from './../editors';
import { getRenderer } from './../renderers';
import { getValidator } from './../validators';

import { registerCellType } from './index';

import '../editors/dateEditor';
import '../renderers/autocompleteRenderer';
import '../validators/dateValidator';

const CELL_TYPE = 'date';

export const type = {
  editor: getEditor(CELL_TYPE),
  // displays small gray arrow on right side of the cell
  renderer: getRenderer('autocomplete'),
  validator: getValidator(CELL_TYPE),
};

registerCellType(CELL_TYPE, type);

export default type;
