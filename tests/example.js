import { Selector } from 'testcafe';

fixture `Getting Started`
    .page `https://handsontable.com/examples?manual-resize&manual-move&conditional-formatting&context-menu&filters&dropdown-menu&headers`;

test('My first test', async t => {
   return(true)
});