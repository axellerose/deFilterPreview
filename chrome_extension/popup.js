let radios = document.querySelectorAll('input[name="bu"]')
let active = document.querySelector('#active')

for(var i = 0, max = radios.length; i < max; i++) {
    radios[i].onclick = function() {
        alert(this.value);
        chrome.storage.sync.set( {
            bu: this.value
        })
    }
}



