chrome.browserAction.onClicked.addListener(function (activeTab) {
  chrome.tabs.executeScript(null, {
    target: { tabId: tabId },
    files: ['contentScripts.js'],
  })
})

