describe('Handsontable demo page', () => {
    it('should have the right title', async () => {
        await browser.url('https://handsontable.com/examples?manual-resize&manual-move&conditional-formatting&context-menu&filters&dropdown-menu&headers')
        await expect(browser).toHaveTitle('Examples | Handsontable');
    })
})