console.log('content runs')

var function1 = function () {

  console.log('function runs')

  let filterElements = document.querySelectorAll('.ft-grouping')
  let filtersArray = []

  for (let filterRow of filterElements) {
    console.log(filterRow)
  }

  chrome.storage.local.set({
    filterRows: filtersArray
  })

  console.log('check end')
}

var button1 = document.createElement('button')
button1.id = 'button1'
button1.onclick = function1
button1.innerHTML = 'Button 1'
button1.style.cssText = 'position: absolute; z-index: 999; height: 50px; width: 75px; top:70px; left: 250px; background-color: #e73373; color: #fff;'

// let showButtonListener = setInterval(() => {
//   document.querySelectorAll('.expressioneer-filter') && document.body.appendChild(button1);
// }, 500);

// let hideButtonListener = setInterval(() => {
//   document.querySelectorAll('.expressioneer-filter') ?? document.body.removeChild(button1);
// })
document.body.appendChild(button1)
