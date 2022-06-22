console.log('content runs')

const retrieveRowCount = () => {
  fetch('https://cloud.coms.opap.gr/filter-activity-json', { mode: 'no-cors' })
    .then(response => response.json())
    .then(data => console.log(data))
}
const selectFilterParameters = () => {
  const allInFilter = document.querySelectorAll('.expression-text > .ft-grouping > *')

  allInFilter.forEach(element => {
    console.log(element.textContent + ' ')
  })
}

const filterButton = document.createElement('button')
filterButton.id = 'filterButton'
filterButton.onclick = retrieveRowCount
filterButton.innerHTML = 'Count Rows'
filterButton.style.cssText = 'position: absolute; z-index: 999; height: 50px; width: 80px; top: 60px; border-radius: 5px; left: calc(50% - 40px); background-color: #3a67aa; color: #fff;'

document.body.appendChild(filterButton)

