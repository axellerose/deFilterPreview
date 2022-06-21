console.log('content runs')



var function1 = function () {

  console.log('function runs')


  // let f4 = document.querySelectorAll('iframe')



  // // console.log('head', f1, f2, f3, 'frames ', f4)


  // for (let i = 0; i < f4.length; i++) {

  //   let classA = ['.fg-head-name', '#navbarHeader', '#carbon-legacy-content']

  //   classA.forEach((e) => {

  //     console.log('frames' + f4[i].contentWindow.querySelectorAll)
  //   })


  // }

  // for (let f of f4) {
  //   // filterRow.style = "color: blue !important"
  //   // filtersArray.push(filter.innerHTML)


  // }


  let filterElements = document.querySelectorAll('.expressioneer-filter');
  let filtersArray = [];

  // console.log('filters : ' + filterElements)

  for (let filterRow of filterElements) {
    // filterRow.style = "color: blue !important"
    // filtersArray.push(filter.innerHTML)
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

let showButtonListener = setInterval(() => {
  document.querySelectorAll('.expressioneer-filter') && document.body.appendChild(button1);
}, 500);

let hideButtonListener = setInterval(() => {
  document.querySelectorAll('.expressioneer-filter') ?? document.body.removeChild(button1);
})
document.body.appendChild(button1)
