'use strict';

const _ = require('lodash');
const config = require('./config');
const migrationExecutor = require('./migrationExecutor');
const storage = require('./storage');

/**
 * Object edit phase using migrationExecutor.
 *
 * @param {PatternItem[]} patterns
 * @param {number} fromVersion
 * @returns {PatternItem[]}
 */
const migrate = function(patterns, fromVersion) {
  let version = fromVersion;

  for (; version < config.version(); version++) {
    patterns = migrationExecutor.execute(patterns, version);
  }

  return patterns;
};

/**
 * Persistence phase using storage.
 *
 * @param {PatternItem[]} patterns
 */
const persist = function(patterns) {
  patterns.forEach(function(pattern) {
    if (storage.findByUrl(pattern.url)) {
      storage.updatePattern(pattern.url, pattern);
    } else {
      storage.addPattern(pattern);
    }
  });
};

/**
 * Assumes that json is validated.
 *
 * @param {object} initialJson
 */
const importJson = function(initialJson) {
  let json = _.cloneDeep(initialJson);
  let version = json.version;
  let patterns = json.pattern;

  console.info('Import start.');

  patterns = migrate(patterns, version);

  persist(patterns);

  console.info('Import done.');
};

module.exports.importJson = importJson;
