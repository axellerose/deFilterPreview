let timeElement = document.getElementById('time')
let nameElement = document.getElementById('name')
let timerElement = document.getElementById('timer')
let headersElement = document.getElementById('headersList')


const updateTimerElements = () => {
  let currentTime = new Date().toLocaleTimeString()

  timeElement.textContent = currentTime

  chrome.storage.local.get('timer', res => {
    let time = res.timer ?? 0
    timerElement.textContent = time
  })

}

updateTimerElements()
setInterval(updateTimerElements, 1000)

chrome.action.setBadgeText({
  text: 'TIME'
}, () => { console.log('time badge set') }
)

chrome.action.setBadgeBackgroundColor({
  color: 'green'
}, () => { console.log('time badge color set') }
)

chrome.storage.sync.get('name', res => {
  let name = res.name ?? 'User'
  nameElement.textContent = `Welcome ${name}`
})

chrome.storage.local.get('filterRows', res => {
  let response = res.filterRows

  for (let filterRow of response) {
    let row = document.createElement('li')
    row.innerHTML = filterRow

    headersElement.appendChild(row)
  }

})
