const describe = require('mocha').describe;
const beforeEach = require('mocha').beforeEach;
const it = require('mocha').it;
const assert = require('assert');
const urlNotification = require('../src/js/urlNotification/main');

const currentVersion = 3;

describe('urlNotification.background', function () {
  beforeEach(function () {
    localStorage.clear();
    localStorage.setItem('version', currentVersion.toString());
    localStorage.setItem('pattern', JSON.stringify([
      { url: 'http://example.com/1', msg: '1', backgroundColor: '111111', displayPosition: 'top', status: 1 },
      { url: 'http://example.com/2', msg: '2', backgroundColor: '222222', displayPosition: 'top', status: 1 },
      { url: 'http://example.com/3', msg: '3', backgroundColor: '333333', displayPosition: 'top', status: 1 },
      { url: 'http://example.com/item/*', msg: 'item', backgroundColor: '000000', displayPosition: 'top', status: 1 },
    ]));
  });

  it('find() - 該当データなし', function() {
    const result = urlNotification.background.find('foo');

    assert.strictEqual(result.matched, false);
    assert.strictEqual(result.data, null);
  });

  it('find() - 該当データあり', function() {
    const result = urlNotification.background.find('http://example.com/1');

    const expectedData = {
      url: 'http://example.com/1',
      message: '1',
      backgroundColor: '111111',
      fontColor: 'ffffff',
      displayPosition: 'top',
    };

    assert.strictEqual(result.matched, true);
    assert.deepStrictEqual(result.data, expectedData);
  });

  it('find() - 該当データあり - パターンにマッチ', function() {
    const result = urlNotification.background.find('http://example.com/item/5');

    const expectedData = {
      url: 'http://example.com/item/*',
      message: 'item',
      backgroundColor: '000000',
      fontColor: 'ffffff',
      displayPosition: 'top',
    };

    assert.strictEqual(result.matched, true);
    assert.deepStrictEqual(result.data, expectedData);
  });

});
