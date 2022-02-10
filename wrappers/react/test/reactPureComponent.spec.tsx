import React from 'react';
import {
  HotTable
} from '../src/hotTable';
import {
  createSpreadsheetData,
  mockElementDimensions,
  mountComponent
} from './_helpers';

/**
 * Worth noting, that although it's possible to use React's Pure Components on renderer components, it doesn't do much, as currently they're recreated on every
 * Handsontable's `render`.
 */
describe('React PureComponents', () => {
  it('should be possible to declare the renderer as PureComponent', async () => {
    class RendererComponent2 extends React.PureComponent<any, any> {
      render(): React.ReactElement<string> {
        return (
          <>
            value: {this.props.value}
          </>
        );
      }
    }

    const hotInstance = mountComponent((
      <HotTable licenseKey="non-commercial-and-evaluation"
                id="test-hot"
                data={createSpreadsheetData(3, 3)}
                width={300}
                height={300}
                rowHeights={23}
                colWidths={50}
                autoRowSize={false}
                autoColumnSize={false}
                init={function () {
                  mockElementDimensions(this.rootElement, 300, 300);
                }}>
        <RendererComponent2 hot-renderer/>
      </HotTable>
    )).hotInstance;

    expect(hotInstance.getCell(0, 0).innerHTML).toEqual('<div>value: A1</div>');
  });

  /*
    Editors cannot be declared as PureComponents, as they're derived from the BaseEditorComponent class.
   */
});
