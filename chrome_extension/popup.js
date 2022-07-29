let activeRadioId = "";
let activeBU = "";

let buList = {
    "TESTING ENVIRONMENT": {
    id: "test",
    link: "https://cloud.coms.opap.gr/filter1",}
  ,
    "VLTS PRODUCTION ENVIRONMENT": {
    id: "vlts",
    link: "https://cloud.coms.opap.gr/filter-vlts-prod",
  },
    "ONLINE PRODUCTION ENVIRONMENT": {
    id: "online",
    link: "https://cloud.coms.opap.gr/filter-online-prod",
  },
    "RETAIL PRODUCTION ENVIRONMENT": {
    id: "retail",
    link: "https://cloud.coms.opap.gr/filter-retail-prod",
  },
}


// chrome.storage.onChanged.addListener(function (changes, namespace) {
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     if (key=='buName') {
//       console.log(
//         `Storage key "${key}" in namespace "${namespace}" changed.`,
//         `Old value was "${oldValue}", new value is "${newValue}".`
//       );

//       let target = document.querySelector(`#${buList[newValue].id}`)
//       if (target) {
//         target.checked = true
//         console.log('target checked')
//       } else {
//         console.log('target not found')
//       }
//     }

//   }
// });


/* 
    Create elements
*/

const addElemets = (x, y, z) => {
  x.appendChild(y);
  x.appendChild(z);
  return x;
};

for (let key in buList) {
  let bu = buList[key]
  let input = document.createElement("input");

  input.type = "radio";
  input.name = "bu";
  input.value = bu.link;
  input.id = bu.id;
  input.title = key;
  input.disabled = true
  input.classList.add('.radio')

  
  input.onclick = function () {
    console.log('on click', this);
    this.checked = true;
    alert(this.value);
    chrome.storage.sync.set(
      {
        inputId: this.id,
        buLink: this.value,
        buName: this.title
      },
      () => {
        activeBU = this.title;
        activeRadioId = this.id;
      }
    );
  };
  let label = document.createElement("label");
  label.for = bu.id;
  label.innerText = key;
  let container = document.createElement("div");
  document
    .querySelector("#popupForm")
    .appendChild(addElemets(container, input, label));

  console.log('ui painted')
}

async function getFromStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, resolve);
  }).then((result) => {
    if (key == null) return result;
    else return result[key];
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  console.log('loaded')
  let buName = await getFromStorage('buName')


  let target = document.querySelector(`#${buList[buName].id}`)  
  if (target) {
    target.checked = true
    console.log('target checked')
  } else {
    console.log('target not found')
  }
} );

// for (var i = 0, max = buList.length; i < max; i++) {
//   let bu = buList[i];
//   let input = document.createElement("input");
//   input.type = "radio";
//   input.name = "bu";
//   input.value = bu.link;
//   input.id = bu.id;
//   input.title = bu.title;
//   input.onclick = function () {
//     console.log('on click', this);
//     this.checked = true;
//     alert(this.value);
//     chrome.storage.sync.set(
//       {
//         inputId: this.id,
//         buLink: this.value,
//         buName: this.title
//       },
//       () => {
//         activeBU = this.title;
//         activeRadioId = this.id;
//       }
//     );
//   };
//   let label = document.createElement("label");
//   label.for = bu.id;
//   label.innerText = bu.title;
//   let container = document.createElement("div");
//   document
//     .querySelector("#popupForm")
//     .appendChild(addElemets(container, input, label));
// }

// for (var i = 0, max = radios.length; i < max; i++) {
//   radios[i].onclick = function () {
//     console.log('on click', this);
//     this.checked = true;
//     alert(this.value);
//     chrome.storage.sync.set(
//       {
//         inputId: this.id,
//         buLink: this.value,
//         buName: this.title
//       },
//       () => {
//         activeBU = this.title;
//         activeRadioId = this.id;
//       }
//     );
//   };
//   radios[i].onchange = function () {
//     console.log('on change ', this)
//   }
// }



/* ========================================================= */






// setInterval(() => {
//   getFromStorage("inputId")
//     .then((res) => {
//       console.log(res);
//       activeRadioId = res;
//       return activeRadioId;
//     })
//     .then(() => {
//       getFromStorage("buName").then((res) => {
//         console.log(res);
//         activeBU = res;
//         return activeBU;
//       });
//     })
//     .then(() => {
//       let checkedRadio = document.querySelector("input[checked]");
//       console.log("checked", checkedRadio);
//       if (checkedRadio === activeBU) {
//         return;
//       } else {
// //        document.querySelector(`input[title='${activeBU}']`).checked ;
//       }
//     });
// }, 5000);

