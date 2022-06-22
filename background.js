chrome.alarms.create({
  periodInMinutes: 1 / 60
})

chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.local.get('timer', (res) => {
    let time = res.timer ?? 0
    chrome.storage.local.set({
      timer: time + 1
    })
    chrome.action.setBadgeText({
      text: `${time + 1}`
    })
  })

})

chrome.browserAction.onClicked.addListener(function (activeTab) {
  chrome.tabs.executeScript(null, {
    target: { tabId: tabId, allFrames: true },
    files: ['contentScripts.js'],
  })
  console.log('clicked')
})