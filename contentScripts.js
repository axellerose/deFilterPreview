/*
  TODO: 
  
*/

const retrieveRowCount = () => {

  const filter = "542E2810-D765-4029-8373-AC3DF7D09713";

  // xhr.send();

  // axios(`https://timer-extension.ngrok.io/rows?filter=${filter}`, (d) => console.log(d));


  fetch(`https://timer-extension.ngrok.io/rows?filter=${filter}`)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(JSON.stringify(error)));
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




const axios = (url, callback) => {

  makeCorsRequest();


  function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    // xhr.responseType = 'blob';
    if ("withCredentials" in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
      // XDomainRequest for IE.
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
  }
  
  // Helper method to parse the title tag from the response.
  function getTitle(text) {
    return text.match('<title>(.*)?</title>')[1];
  }
  
  // Make the actual CORS request.
  function makeCorsRequest() {
    // This is a sample server that supports CORS.
    var url = 'http://html5rocks-cors.s3-website-us-east-1.amazonaws.com/index.html';
  
    var xhr = createCORSRequest('GET', url);
    if (!xhr) {
      alert('CORS not supported');
      return;
    }
  
    // Response handlers.
    xhr.onload = function() {
      var text = xhr.responseText;
      var title = getTitle(text);
      alert('Response from CORS request to ' + url + ': ' + title);
      callback(text)
    };
  
    xhr.onerror = function() {
      alert('Woops, there was an error making the request.');
    };
  
    xhr.send();
  }
}
