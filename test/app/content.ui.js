const { describe, before, beforeEach, afterEach, after, it } = require('mocha');
const assert = require('assert');
const contentFind = require('../../src/js/app/content.find');
const testUtil = require('../../test_lib/util');

describe('content.ui', () => {
  before(testUtil.uiBase.before);
  beforeEach(testUtil.uiBase.beforeEach);
  beforeEach(() => {
    testUtil.uiBase.initDom(testUtil.getHtml('test_resource/html/content.01.html'), {
      url: 'https://example.com/',
    });
  });
  afterEach(testUtil.uiBase.afterEach);
  after(testUtil.uiBase.after);

  it('mouseover (test for coverage)', () => {
    contentFind.sendMessage();

    testUtil.chrome.contentFindChain('https://example.com/', testUtil.makeFoundItem({
      status: 1,
      displayPosition: 'top_left',
    }));

    assert.strictEqual(testUtil.content.message().shown(), true);

    const $message = testUtil.content.message().jqueryObject();
    $message.trigger('mouseover');
  });

  it('mouseout (test for coverage)', () => {
    contentFind.sendMessage();

    testUtil.chrome.contentFindChain('https://example.com/', testUtil.makeFoundItem({
      status: 1,
      displayPosition: 'top_left',
    }));

    assert.strictEqual(testUtil.content.message().shown(), true);

    const $message = testUtil.content.message().jqueryObject();
    $message.trigger('mouseout');
  });
});
