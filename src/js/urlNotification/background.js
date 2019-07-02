'use strict';

const finder = require('./finder');
const migration = require('./migration');

/**
 * @typedef {object} FindResult
 * @property {boolean} matched
 * @property {(FindResultData|null)} data Depends on the value of matched
 */

/**
 * @typedef {object} FindResultData
 * @property {string} url
 * @property {string} message
 * @property {string} backgroundColor
 * @property {string} fontColor
 * @property {string} displayPosition
 */

const migrate = function() {
  while (migration.shouldMigrate()) {
    migration.migrateFrom(migration.currentVersion());
  }
};

/**
 * @param {string} url
 * @return {FindResult}
 */
const find = function(url) {
  const item = finder.findFor(url);

  return {
    matched: item !== null,
    data: item,
  };
};

module.exports.migrate = migrate;
module.exports.find = find;
