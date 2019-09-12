const popup = require('./popup');
const $ = require('jquery');

$(function () {
  $('#i18n_label_status').text(chrome.i18n.getMessage('label_status'));
  $('#i18n_label_enabled').text(chrome.i18n.getMessage('label_enabled'));
});

$(function () {

  /**
   * @type {number}
   */
  let tabId;

  /**
   * @param {string} url
   * @returns {MessageBrowserActionFind}
   */
  const createRequest = function(url) {
    return {
      command: 'browser_action:find',
      data: {
        url: url,
      },
    };
  };

  /**
   * @param {FindResult} response
   */
  const process = function(response) {
    if (response.matched === false) {
      $('#block_for_matched_page').hide();

      return;
    }

    $('#pattern_status')
      .prop('checked', response.data.status === 1)
      .on('click', function() {
        const url = response.data.url;
        const status = $(this).prop('checked') ? 1 : 0;

        popup.updateStatus(tabId, url, status);
      });
  };

  chrome.tabs.query({
    currentWindow: true,
    active: true,
  }, function(/** @type {chrome.tabs.Tab[]} */ tabs) {
    tabId = tabs[0].id;
    chrome.runtime.sendMessage(createRequest(tabs[0].url), process);
  });
});

$(function () {
  $('<a>')
    .attr('href', '#')
    .text(chrome.i18n.getMessage('label_options'))
    .on('click', function(e) {
      e.preventDefault();
      chrome.tabs.create({
        url: chrome.runtime.getURL('html/options.html'),
      });
    })
    .appendTo($('#link_options'));
});
