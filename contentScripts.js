console.log('content runs')



var function1 = function () {

  console.log('function runs')

  if (window != top) {
    parent.postMessage({ fromExtension: true }, '*')
    addEventListener('message', function (event) {
      if (event.data && event.data.inserHTML) {
        document.execCommand('insertHTML', false, event.data.insertHTML)
      }
    })
  } else {
    var test_html = 'test string'
    // Explanation of injection at https://stackoverflow.com/a/9517879/938089 :
    // Run code in the context of the page, so that the `contentWindow`
    //  property becomes accessible
    var script = document.createElement('script')
    script.textContent = '(' + function (s_html) {
      addEventListener('message', function (event) {
        if (event.data.fromExtension === true) {
          var iframe = document.getElementById('iframe1')
          if (iframe && (iframe.contentWindow === event.source)) {
            // Window recognised, post message back
            iframe.contentWindow.postMessage({ insertHTML: s_html }, '*')
          }
        }
      })
    } + ')(' + JSON.stringify(test_html) + ');';
    (document.head || document.documentElement).appendChild(script)
    script.parentNode.removeChild(script)
  }

  let f4 = document.querySelectorAll('iframe')



  // console.log('head', f1, f2, f3, 'frames ', f4)


  for (let i = 0; i < f4.length; i++) {

    let classA = ['.fg-head-name', '#navbarHeader', '#carbon-legacy-content']

    classA.forEach((e) => {

      console.log('frames' + f4[i].contentWindow.querySelectorAll(e))
    })


  }

  for (let f of f4) {
    // filterRow.style = "color: blue !important"
    // filtersArray.push(filter.innerHTML)


  }


  let filterElements = document.querySelectorAll('.btn')
  let filtersArray = []

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

document.body.appendChild(button1)
