console.log('content runs')

const retrieveRowCount = () => {

  // var xhr = new XMLHttpRequest();
  // xhr.open('GET', 'https://cloud.coms.opap.gr/custom-filter', true);
  // xhr.responseType = 'blob';
  // xhr.onload = function(e) {
  //   console.log(this.response);
  // };

  // xhr.send();

  axios('https://cloud.coms.opap.gr/custom-filter', (d) => console.log(d));


  // fetch('https://cloud.coms.opap.gr/custom-filter', { mode: 'no-cors' })
  //   .then(response => response.json())
  //   .then(data => console.log(data))
  //   .catch(error => console.error(JSON.stringify(error)));
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




const axios = (url, callback) => {

  makeCorsRequest();


  function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
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
