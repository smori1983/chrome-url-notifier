const background = require('../urlNotification/background');
const badge = require('./badge');

const onInstalledListener = function() {
  background.migrate();
};

chrome.runtime.onInstalled.addListener(onInstalledListener);

/**
 * @typedef {Object} MessageContentScriptsFind
 * @property {string} command
 * @property {{url: string}} data
 */

/**
 * @param {MessageContentScriptsFind} request
 * @param {chrome.runtime.MessageSender} sender
 * @param {function} sendResponse
 */
const contentScriptsFindListener = function(request, sender, sendResponse) {
  if (request.command !== 'content_scripts:find') {
    return;
  }

  const result = background.find(request.data.url, { ignoreStatus: true });
  const status = result.matched ? result.data.status : null;

  badge.draw(sender.tab.id, result.matched, status);

  sendResponse(result);
};

/**
 * @typedef {Object} MessageBrowserActionFind
 * @property {string} command
 * @property {{url: string}} data
 */

/**
 * @param {MessageBrowserActionFind} request
 * @param {chrome.runtime.MessageSender} sender
 * @param {function} sendResponse
 */
const browserActionFindListener = function(request, sender, sendResponse) {
  if (request.command !== 'browser_action:find') {
    return;
  }

  const findResult = background.find(request.data.url, { ignoreStatus: true });

  sendResponse(findResult);
};

/**
 * @typedef {Object} MessageBrowserActionUpdateStatus
 * @property {string} command
 * @property {{url: string, status: number, tabId: number}} data
 */

/**
 * @param {MessageBrowserActionUpdateStatus} request
 * @param {chrome.runtime.MessageSender} sender
 * @param {function} sendResponse
 */
const browserActionUpdateStatusListener = function(request, sender, sendResponse) {
  if (request.command !== 'browser_action:update:status') {
    return;
  }

  // TODO: Check return value.
  background.updatePattern(request.data.url, { status: request.data.status });

  badge.draw(request.data.tabId, true, request.data.status);

  const item = background.findByUrl(request.data.url);

  sendResponse({
    item: item,
    status: request.data.status,
  });
};

chrome.runtime.onMessage.addListener(contentScriptsFindListener);
chrome.runtime.onMessage.addListener(browserActionFindListener);
chrome.runtime.onMessage.addListener(browserActionUpdateStatusListener);
