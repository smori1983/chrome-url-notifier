const { describe, beforeEach, it } = require('mocha');
const assert = require('assert');
const testUtil = require('../test_lib/util');
const SUT = require('../src/js/urlNotification/migration');
const storage = require('../src/js/urlNotification/storage');

describe('urlNotification.migration', function() {
  describe('version', function () {
    it('キーなし', function () {
      testUtil.clearStorage();

      assert.strictEqual(SUT.hasVersion(), false);
      assert.strictEqual(SUT.currentVersion(), 0);
    });

    it('キーあり - 不正値 - 小数', function () {
      testUtil.setUpStorage('1.1', []);

      assert.strictEqual(SUT.hasVersion(), false);
      assert.strictEqual(SUT.currentVersion(), 0);
    });

    it('キーあり - 不正値 - 文字列', function () {
      testUtil.setUpStorage('foo', []);

      assert.strictEqual(SUT.hasVersion(), false);
      assert.strictEqual(SUT.currentVersion(), 0);
    });

    it('キーあり - 正常値', function () {
      testUtil.setUpStorage('1', []);

      assert.strictEqual(SUT.hasVersion(), true);
      assert.strictEqual(SUT.currentVersion(), 1);
    });
  });

  describe('0to3', function () {
    beforeEach(function () {
      testUtil.setUpStorage('', [
        { url: 'http://example.com/1', msg: '1' },
      ]);
    });

    it('current version is 0', function () {
      assert.strictEqual(SUT.currentVersion(), 0);
    });

    it('execute migration', function () {
      const expectedBefore = [
        { url: 'http://example.com/1', msg: '1' },
      ];

      assert.deepStrictEqual(storage.getAll(), expectedBefore);

      SUT.execute();

      const expectedAfter = [
        { url: 'http://example.com/1', msg: '1', backgroundColor: '000000', displayPosition: 'top', status: 1 },
      ];

      assert.deepStrictEqual(storage.getAll(), expectedAfter);

      assert.strictEqual(SUT.currentVersion(), testUtil.currentVersion());
    });
  });

  describe('1to3', function() {
    beforeEach(function() {
      testUtil.setUpStorage('1', [
        { url: 'http://example.com/1', msg: '1', backgroundColor: '000000' },
      ]);
    });

    it('current version is 1', function() {
      assert.strictEqual(SUT.currentVersion(), 1);
    });

    it('execute migration', function() {
      const expectedBefore = [
        { url: 'http://example.com/1', msg: '1', backgroundColor: '000000' },
      ];

      assert.deepStrictEqual(storage.getAll(), expectedBefore);

      SUT.execute();

      const expectedAfter = [
        { url: 'http://example.com/1', msg: '1', backgroundColor: '000000', displayPosition: 'top', status: 1 },
      ];

      assert.deepStrictEqual(storage.getAll(), expectedAfter);

      assert.strictEqual(SUT.currentVersion(), testUtil.currentVersion());
    });
  });

  describe('2to3', function() {
    beforeEach(function() {
      testUtil.setUpStorage('2', [
        { url: 'http://example.com/1', msg: '1', backgroundColor: '000000', displayPosition: 'bottom' },
      ]);
    });

    it('current version is 2', function() {
      assert.strictEqual(SUT.currentVersion(), 2);
    });

    it('execute migration', function() {
      const expectedBefore = [
        { url: 'http://example.com/1', msg: '1', backgroundColor: '000000', displayPosition: 'bottom' },
      ];

      assert.deepStrictEqual(storage.getAll(), expectedBefore);

      SUT.execute();

      const expectedAfter = [
        { url: 'http://example.com/1', msg: '1', backgroundColor: '000000', displayPosition: 'bottom', status: 1 },
      ];

      assert.deepStrictEqual(storage.getAll(), expectedAfter);

      assert.strictEqual(SUT.currentVersion(), testUtil.currentVersion());
    });
  });
});
