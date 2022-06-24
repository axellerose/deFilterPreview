/*
  TODO: 
  
*/

const retrieveRowCount = () => {
  fetch('https://cloud.coms.opap.gr/filter-activity-json')
    .then(response => response.json())
    .then(data => console.log(data))
}
const selectFilterParameters = () => {
  const allInFilter = document.querySelectorAll('.expression-text > .ft-grouping > *')

  allInFilter.forEach(element => {
    console.log(element.textContent + ' ')
  })
}

const sendFilter = () => {
  const data = document.querySelector('#filterInput').value
  console.log(data)
}

const filterButton = document.createElement('button')
filterButton.id = 'filterButton'
filterButton.onclick = sendFilter
filterButton.innerHTML = 'Run Filter'
filterButton.style.cssText = 'position: absolute; z-index: 999; font-size: 12px; height: 50px; width: 90px; top: 60px; border-radius: 5px; left: calc(50% - 40px); background-color: #3a67aa; color: #fff;'

const filterInput = document.createElement('input')
filterInput.id = 'filterInput'
filterInput.type = 'text'
filterInput.style.cssText = 'position: absolute; z-index: 999; font-size: 12px; height: 30px; width: 160px; top: 70px; border-radius: 5px; left: calc(50% + 60px); background-color: #fff; color: #000;'
filterInput.placeholder = 'Filter key'

document.body.appendChild(filterButton)
document.body.appendChild(filterInput)

