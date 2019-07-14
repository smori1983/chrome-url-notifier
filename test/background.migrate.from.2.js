const describe = require('mocha').describe;
const beforeEach = require('mocha').beforeEach;
const it = require('mocha').it;
const assert = require('assert');
const SUT = require('../src/js/urlNotification/main');
const testUtil = require('../test_lib/util');

describe('urlNotification.background.migrate.from.2', function() {
  describe('no data', function() {
    it('migrate', function () {
      testUtil.clearStorage();

      SUT.background.migrate();

      const expected = [];

      assert.deepStrictEqual(SUT.storage.getAll(), expected);

      assert.strictEqual(SUT.migration.currentVersion(), testUtil.currentVersion());
    });
  });

  describe('with data', function() {
    beforeEach(function () {
      testUtil.setUpStorage('2', [
        { url: 'http://example.com/1', msg: '1', backgroundColor: '111111', displayPosition: 'top' },
        { url: 'http://example.com/2', msg: '2', backgroundColor: '222222', displayPosition: 'bottom' },
        { url: 'http://example.com/3', msg: '3', backgroundColor: '333333', displayPosition: 'top' },
      ]);
    });

    it('migrate', function() {
      SUT.background.migrate();

      const expected = [
        { url: 'http://example.com/1', msg: '1', backgroundColor: '111111', displayPosition: 'top',    status: 1 },
        { url: 'http://example.com/2', msg: '2', backgroundColor: '222222', displayPosition: 'bottom', status: 1 },
        { url: 'http://example.com/3', msg: '3', backgroundColor: '333333', displayPosition: 'top',    status: 1 },
      ];

      assert.deepStrictEqual(SUT.storage.getAll(), expected);

      assert.strictEqual(SUT.migration.currentVersion(), testUtil.currentVersion());
    });
  });
});
