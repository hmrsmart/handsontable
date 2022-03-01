import { AutocompleteCellType, CELL_TYPE as AUTOCOMPLETE_TYPE } from './autocompleteType';
import { CheckboxCellType, CELL_TYPE as CHECKBOX_TYPE } from './checkboxType';
import { DateCellType, CELL_TYPE as DATE_TYPE } from './dateType';
import { DropdownCellType, CELL_TYPE as DROPDOWN_TYPE } from './dropdownType';
import { HandsontableCellType, CELL_TYPE as HANDSONTABLE_TYPE } from './handsontableType';
import { MultiCellType, CELL_TYPE as MULTI_TYPE } from './multiType';
import { NumericCellType, CELL_TYPE as NUMERIC_TYPE } from './numericType';
import { PasswordCellType, CELL_TYPE as PASSWORD_TYPE } from './passwordType';
import { TextCellType, CELL_TYPE as TEXT_TYPE } from './textType';
import { TimeCellType, CELL_TYPE as TIME_TYPE } from './timeType';
import {
  registerCellType,
} from './registry';

/**
 * Registers all available cell types.
 */
export function registerAllCellTypes() {
  registerCellType(AutocompleteCellType);
  registerCellType(CheckboxCellType);
  registerCellType(DateCellType);
  registerCellType(DropdownCellType);
  registerCellType(HandsontableCellType);
  registerCellType(MultiCellType);
  registerCellType(NumericCellType);
  registerCellType(PasswordCellType);
  registerCellType(TextCellType);
  registerCellType(TimeCellType);
}

export {
  AutocompleteCellType, AUTOCOMPLETE_TYPE,
  CheckboxCellType, CHECKBOX_TYPE,
  DateCellType, DATE_TYPE,
  DropdownCellType, DROPDOWN_TYPE,
  HandsontableCellType, HANDSONTABLE_TYPE,
  MultiCellType, MULTI_TYPE,
  NumericCellType, NUMERIC_TYPE,
  PasswordCellType, PASSWORD_TYPE,
  TextCellType, TEXT_TYPE,
  TimeCellType, TIME_TYPE,
};

export {
  getCellType,
  getRegisteredCellTypeNames,
  getRegisteredCellTypes,
  hasCellType,
  registerCellType,
} from './registry';
