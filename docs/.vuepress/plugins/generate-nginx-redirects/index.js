const fsp = require('fs').promises;
const path = require('path');
const { logger } = require('@vuepress/shared-utils');

const fileHead = '# --- THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY!!! ---';
const pluginName = 'hot/generate-nginx-redirects';

/**
 * Dedupes the slashes in the string.
 *
 * @param {string} string String to process.
 * @returns {string}
 */
function dedupeSlashes(string) {
  return string.replace(/(\/)+/g, '$1');
}

module.exports = (options, context) => {
  const outputFile = options.outputFile || path.resolve(context.sourceDir, 'redirects.conf');

  return {
    name: pluginName,

    async chainMarkdown() {
      // Workaround for the lack of the hook/callback in the VuePress that is triggered
      // once before the "extendPageData" function.
      try {
        await fsp.writeFile(outputFile, fileHead);
      } catch (ex) {
        logger.error(`Something bad happens while writing to the file (${outputFile}): ${ex}`);
      }

    },

    /**
     * Based on the permalink of the latest docs version generate nginx redirect rules.
     *
     * @param {object} $page The $page value of the page you’re currently reading.
     */
    async extendPageData($page) {
      if (!$page.currentVersion || !$page.latestVersion) {
        logger.error('The "currentVersion" and/or "latestVersion" is not set.');
      }

      if ($page.latestVersion && $page.currentVersion === $page.latestVersion && $page.frontmatter.permalink) {
        const from = dedupeSlashes(`/${$page.latestVersion}${$page.frontmatter.permalink}/`);
        const to = dedupeSlashes(`/${context.base}${$page.frontmatter.permalink}/`);

        // http://nginx.org/en/docs/http/ngx_http_rewrite_module.html#rewrite
        const redirectRule = `rewrite ^${from}?$ ${to} permanent;`;

        try {
          await fsp.appendFile(outputFile, `\n${redirectRule}`);
        } catch (ex) {
          logger.error(`Something bad happens while writing to the file (${outputFile}): ${ex}`);
        }
      }
    }
  };
};
