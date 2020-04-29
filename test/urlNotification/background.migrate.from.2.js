const { describe, it } = require('mocha');
const assert = require('assert');
const testUtil = require('../../test_lib/util');
const SUT = require('../../src/js/urlNotification/background');
const storage = require('../../src/js/urlNotification/storage');
const sharedMigrate = require('./shared/migrate');

describe('urlNotification.background.migrate.from.2', function() {
  describe('no data', function() {
    sharedMigrate.runNoData('2');
  });

  describe('with data', function() {
    it('migrate', function() {
      testUtil.setUpStorage('2', [
        {url: 'http://example.com/1', msg: '1', backgroundColor: '111111', displayPosition: 'top'},
        {url: 'http://example.com/2', msg: '2', backgroundColor: '222222', displayPosition: 'bottom'},
        {url: 'http://example.com/3', msg: '3', backgroundColor: '333333', displayPosition: 'top'},
      ]);

      SUT.migrate();

      const expected = [
        {url: 'http://example.com/1', msg: '1', backgroundColor: '111111', displayPosition: 'top',    status: 1},
        {url: 'http://example.com/2', msg: '2', backgroundColor: '222222', displayPosition: 'bottom', status: 1},
        {url: 'http://example.com/3', msg: '3', backgroundColor: '333333', displayPosition: 'top',    status: 1},
      ];

      assert.deepStrictEqual(storage.getAll(), expected);
      assert.strictEqual(storage.currentVersion(), testUtil.currentVersion());
    });
  });
});
