/*
  TODO: 
  
*/

const retrieveRowCount = (filter) => {

  // const filter = "542E2810-D765-4029-8373-AC3DF7D09713";


  fetch(`https://timer-extension.ngrok.io/rows?filter=${filter}`)
    .then(response => response.json())
    .then(data => {
      const { RowCount } = data;
      console.log(RowCount)
      /// show me somewhere
    })
    .catch(error => console.error(JSON.stringify(error)))
}
const selectFilterParameters = () => {
  const allInFilter = document.querySelectorAll('.expression-text > .ft-grouping > *')

  allInFilter.forEach(element => {
    console.log(element.textContent + ' ')
  })
}

const sendFilter = () => {
  const data = document.querySelector('#filterInput').value
  retrieveRowCount(data)
  // console.log(data)
}

const filterButton = document.createElement('button')
filterButton.id = 'filterButton'
filterButton.onclick = function (){sendFilter(), retrieveRowCount()}
filterButton.innerHTML = 'Run Filter'
filterButton.style.cssText = 'position: absolute; z-index: 999; font-size: 12px; height: 50px; width: 90px; top: 60px; border-radius: 5px; left: calc(50% - 40px); background-color: #3a67aa; color: #fff;'

const filterInput = document.createElement('input')
filterInput.id = 'filterInput'
filterInput.type = 'text'
filterInput.style.cssText = 'position: absolute; z-index: 999; font-size: 12px; height: 30px; width: 160px; top: 70px; border-radius: 5px; left: calc(50% + 60px); background-color: #fff; color: #000;'
filterInput.placeholder = 'Filter key'

document.body.appendChild(filterButton)
document.body.appendChild(filterInput)
