'use strict';

const storage = require('./storage');

/**
 * @param {string} url
 * @returns {(PatternItem|null)}
 */
const find = function(url) {
  let i, len, patterns = storage.getAll();

  for (i = 0, len = patterns.length; i < len; i++) {
    if (makeRegExp(patterns[i].url).test(url)) {
      return patterns[i];
    }
  }

  return null;
};

/**
 * @param {string} url
 * @returns {RegExp}
 */
const makeRegExp = function(url) {
  return new RegExp(convertForMatching(url));
};

/**
 * @param {string} url
 * @returns {string}
 */
const convertForMatching = function(url) {
  return url.
    replace(/[/.+\-?]/g, function(matched) {
      return '\\' + matched;
    }).
    replace(/\*/g, function() {
      return '[0-9a-zA-Z-_]+';
    });
};

module.exports.findFor = find;
