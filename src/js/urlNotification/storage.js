'use strict';

/**
 * @typedef {object} PatternItem
 * @property {string} url Added schema version: 0
 * @property {string} msg Added schema version: 0
 * @property {string} [backgroundColor] Added schema version: 1
 * @property {string} [displayPosition] Added schema version: 2
 * @property {number} [status] Added schema version: 3
 */

const key = {
  version: 'version',
  pattern: 'pattern',
};

/**
 * @returns {boolean}
 */
const hasVersion = function() {
  return isValidVersion(getVersion());
};

/**
 * Gets the version stored in storage.
 *
 * @returns {number}
 */
const currentVersion = function() {
  const version = getVersion();

  if (isValidVersion(version)) {
    return parseInt(version, 10);
  }

  return 0;
};

const getVersion = function() {
  return localStorage.getItem(key.version);
};

/**
 * @returns {boolean}
 */
const isValidVersion = function(value) {
  return (typeof value === 'string') && (/^\d+$/.test(value));
};

/**
 * @param {number} version
 */
const saveVersion = function(version) {
  localStorage.setItem(key.version, version.toString());
};

/**
 * @param {PatternItem[]} data
 */
const savePattern = function(data) {
  localStorage.setItem(key.pattern, JSON.stringify(data));
};

/**
 * @returns {number}
 */
const getCount = function() {
  return getAll().length;
};

/**
 * @returns {PatternItem[]}
 */
const getAll = function() {
  const data = localStorage.getItem(key.pattern);

  if (data === null) {
    return [];
  }

  return JSON.parse(data);
};

/**
 * Finds pattern item by exact match of URL pattern.
 *
 * @param {string} url
 * @returns {(PatternItem|null)}
 */
const findByUrl = function(url) {
  let i, len, patterns = getAll();

  for (i = 0, len = patterns.length; i < len; i++) {
    if (patterns[i].url === url) {
      return patterns[i];
    }
  }

  return null;
};

/**
 * @param {PatternItem} pattern
 */
const addPattern = function(pattern) {
  if (findByUrl(pattern.url)) {
    return;
  }

  savePattern(getAll().concat(pattern));
};

/**
 * @param {string} originalUrl
 * @param {PatternItem} pattern
 */
const updatePattern = function(originalUrl, pattern) {
  if (findByUrl(originalUrl)) {
    deletePattern(originalUrl);
    addPattern(pattern);
  }
};

/**
 * @param {string} url
 */
const deletePattern = function(url) {
  const newData = getAll().filter(function(pattern) {
    return pattern.url !== url;
  });

  savePattern(newData);
};

const deleteAll = function() {
  savePattern([]);
};

/**
 * @param {number} version
 * @param {PatternItem[]} patterns
 */
const replace = function(version, patterns) {
  saveVersion(version);
  savePattern(patterns);
};

module.exports.hasVersion = hasVersion;
module.exports.currentVersion = currentVersion;
module.exports.getCount = getCount;
module.exports.getAll = getAll;
module.exports.findByUrl = findByUrl;
module.exports.addPattern = addPattern;
module.exports.updatePattern = updatePattern;
module.exports.deletePattern = deletePattern;
module.exports.deleteAll = deleteAll;
module.exports.replace = replace;
