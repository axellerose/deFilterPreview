const retrieveRowCount = (filter) => {
  console.log('filter key:', filter)
  // const filter = "542E2810-D765-4029-8373-AC3DF7D09713";

  fetch(`https://timer-extension.ngrok.io/rows?filter=${filter}`)
    .then(response => response.json())
    .then(data => {
      const { RowCount } = data
      console.log(RowCount)
      document.querySelector('#filterInput').value = RowCount
    })
    .catch(error => console.error(JSON.stringify(error)))
}

const sendFilter = () => {
  let data
  chrome.storage.sync.get(null, function (items) {
    var allKeys = Object.keys(items)
    var allValues = Object.values(items)
    data = allValues[1]

    retrieveRowCount(data)
  })

}

const collectData = () => {

  let filterObject = {
    DEname: '',
    filterKey: '',
    filterText: []
  }

  chrome.storage.sync.get('filterText', function (res) {
    filterObject.filterText = res.filterText
  })

  try {

    if (!document.querySelectorAll('.ft-filter-preview-source')[0]) {
      chrome.storage.sync.get('DEname', function (res) {
        filterObject.DEname = res.DEname
      })
    } else {
      DEname = document.querySelectorAll('.ft-filter-preview-source')[0].textContent
      chrome.storage.sync.set({
        DEname,
      }, () => console.log('de name set to storage: ', DEname))
    }

    if (!document.querySelectorAll('.carb-pop-input')[2]) {
      chrome.storage.sync.get('fitlerKey', function (res) {
        filterObject.filterKey = res.fitlerKey
      })
    } else {
      filterKey = document.querySelectorAll('.carb-pop-input')[2].value
      chrome.storage.sync.set({
        filterKey,
      }, () => console.log('filter key set to storage: ', filterKey))
    }

    const allInFilter = document.querySelectorAll('.expression-text > .ft-grouping > *')

    allInFilter.forEach(element => {
      filterObject.filterText.push(element.textContent)
      chrome.storage.sync.set({ filterText: filterObject.filterText })
    })

  } catch (e) {
    console.log('failed collect data', e)
  }

}

const filterButton = document.createElement('button')
filterButton.id = 'filterButton'

filterButton.onclick = sendFilter

filterButton.innerHTML = 'Run Filter'
filterButton.style.cssText = 'font-size: 12px; height: 26px; margin-right: 10px; '
filterButton.classList.add('btn', 'btn-primary', 'btn-large')

const filterInput = document.createElement('input')
filterInput.id = 'filterInput'
filterInput.type = 'text'
filterInput.style.cssText = 'font-size: 12px; color: #000;border: 1px solid #D6D6D6;padding: 1px 3px;border-radius: 6px; margin-top: 3px;'
filterInput.placeholder = 'Filter key'

const filterOutput = document.createElement('h2')
filterOutput.id = 'filterOutput'
filterOutput.style.cssText = 'color: #e73e73;'
filterOutput.textContent = ''

const filterContainer = document.createElement('div')
filterContainer.style.cssText = 'display: flex; justify-content: center; z-index: 999; position: relative; width: 30%; margin-left: 35%;'

filterContainer.id = 'filterContainer'
filterContainer.appendChild(filterButton)
filterContainer.appendChild(filterOutput)
filterContainer.appendChild(filterInput)



setInterval(() => {
  const headerContainer = document.querySelector('.op-head')

  const editFilterPage = document.querySelector('.filter-text-heading')
  const filterOverviewPage = document.querySelector('.ft-filter-preview-source')
  const headerInEdit = document.querySelector('.expressions-wrap')

  const container = document.querySelector('#filterContainer')

  if ((editFilterPage || filterOverviewPage) && container) {

  } else if (filterOverviewPage) {
    headerContainer.appendChild(filterContainer)
    collectData()
  } else if (editFilterPage) {
    headerInEdit.appendChild(filterContainer)
  } else {
    filterContainer.remove()
  }

}, 1000)
