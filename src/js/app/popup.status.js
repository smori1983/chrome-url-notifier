/**
 * @param {number} tabId
 * @param {string} url
 * @param {number} status
 */
const updateStatus = (tabId, url, status) => {
  /**
   * @param {number} tabId
   * @param {string} url
   * @param {number} status
   * @returns {MessageBrowserActionUpdateStatus}
   */
  const createRequest = (tabId, url, status) => {
    return {
      command: 'browser_action:update:status',
      data: {
        url: url,
        status: status,
        tabId: tabId,
      },
    };
  };

  const process = (response) => {
    chrome.tabs.sendMessage(tabId, {
      command: 'tab:notify:status',
      data: {
        item: response.item,
        status: response.status,
      },
    });
  };

  chrome.runtime.sendMessage(createRequest(tabId, url, status), process);
};

module.exports.updateStatus = updateStatus;
