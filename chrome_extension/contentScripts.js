let deNameFromStorage = ''
let filterKeyFromStorage = ''
let urlFromStorage = ''

async function getFromStorage(key) {
  return new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, resolve);
  })
      .then(result => {
          if (key == null) return result;
          else return result[key];
      });
}


/*   
      On chrome extension storage change event listener
*/

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


chrome.storage.onChanged.addListener(function (changes, namespace) {
for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
  if (key=='buName') {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
    chrome.storage.sync.set({
      buLink: buList[newValue].link

    })
    let target = document.querySelector(`#${buList[newValue].id}`)
    if (target) {
      target.checked = true
      console.log('target checked')
    } else {
      console.log('target not found')
    }
  }

}
});

/*   
      End of On chrome extension storage change event listener
*/



const retrieveRowCount = (filter, deName, filterKey, unitUrl) => {

  const data = {
    deName,
    filter,
    filterKey,
    unitUrl
  }

  console.log(data)
  fetch(unitUrl, {
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      const rows = data.postRequestResultObject.rowCount
      console.log('RowsCount: ', rows)
      document.querySelector('#filterButton').innerHTML = rows
    })
    .catch(error => console.error(JSON.stringify(error)))
}

const sendFilter = async  () => {

  const filter = () => ({
    LeftOperand: {},
    LogicalOperator: "",
    RightOperand: {},
  })

  const operand = () => ({
    Property: "",
    SimpleOperator: "",
    Value: "",
  })

  const convertOperator = (value) => {
    let operator = ''

    switch (value) {
      case "is equal to":
        operator = 'equals'
        break
      case "is not equal to":
        operator = "notEquals"
        break
      case "is greater than":
        operator = 'greaterThan'
        break
      case "is greater than or equal":
        operator = 'greaterThanOrEqual'
        break
      case "is less than":
        operator = 'lessThan'
        break
      case "is less than or equal":
        operator = 'lessThanOrEqual'
        break
      case "is empty":
        operator = 'equals'
        break
      case "is not empty":
        operator = 'notEquals'
        break
      case "in":
        operator = 'IN'
        break
      case "is":
        operator = 'equals'
        break
      case "exists in":
        operator = 'existsInString'
        break
      case "exists in whole word":
        oeprator = 'existsInStringAsWord'
        break
      case "does not exist in":
        operator = 'notExistsInString'
        break
      case 'begins with':
        operator = 'beginsWith'
        break
      case "ends with":
        operator = 'endsWith'
        break
      case 'contains':
        operator = 'contains'
        break
      case 'does not contain':
        operator = 'notContains'
        break
      default:
        console.log('convert operator error')
    }
    return operator
  }



  function extractFilter(root) {

    function convertValue (v) {
      let value = ''
      switch (v) {
        case 'true':
          value = true
          break;
        case 'false':
          value = false
          break;
        default:
          value = v
          break;
      }
      return value
    }   

    const conditionHandler = root.querySelector(".expressioneer-handle")

    // console.log("extracting", conditionHandler);
    if (conditionHandler) {
      const property = conditionHandler.querySelector(".expressioneer-condition-name").innerText
      const operator = conditionHandler.querySelector(".expressioneer-condition-operators").innerText

      const value = conditionHandler.querySelector(".expressioneer-condition-value").innerText

      const op = operand()

      op.Property = property
      op.SimpleOperator = convertOperator(operator)

      op.Value = convertValue(value)

      return op
    } else {
      console.error('extract filter cannot find .expressioneer-handle')
    }
  }

  function filterFactory(simpleFilters, operator) {

    function addToComplexFilter(simpleFilters, operator, childFilter) {
      const complexFilter = filter()

      complexFilter.LeftOperand = childFilter
      complexFilter.LogicalOperator = operator
      complexFilter.RightOperand = simpleFilters.shift()

      return complexFilter
    }

    // console.log("incomming simple filters to factory", JSON.stringify(simpleFilters))

    let complexFilter = filter()

    if (simpleFilters.length >= 2) {


      complexFilter.LeftOperand = simpleFilters.shift()
      complexFilter.LogicalOperator = operator
      complexFilter.RightOperand = simpleFilters.shift()

      if (simpleFilters.length) {

        for (let i = 0; i < simpleFilters.length; i++) {
          complexFilter = addToComplexFilter(simpleFilters, operator, complexFilter)
        }

      }
    }

    return complexFilter
  }

  function findFilter(root, oper) {
    // console.log("find filter root", root);
    const filterRoot = root.querySelector(".condition-wrap")

    const logicalOperatorElement = filterRoot.querySelector("span")

    let operator = oper

    if (logicalOperatorElement) {
      operator = logicalOperatorElement.innerText
    }

    const conditions = filterRoot.querySelector(".conditions") // complex nested filters

    // console.log("found conditions!", conditions);

    if (conditions && conditions.querySelector(".conditions")) { // there are nested filters
      const expressions = conditions.children[0].children // ul > li elements

      // console.log("complex fiolter expressions", expressions)

      const complexFilters = []

      for (let i = 0; i < expressions.length; i++) {
        complexFilters.push(findFilter(expressions[i])) /// add oper?
      }

      // console.log("complex filters arr before final factory", complexFilters);

      return filterFactory(complexFilters, operator)

    } else { // no nested filters, simple filter part
      const conditionGroup = filterRoot.querySelector(".condition-group") // simple filters
      if (conditionGroup) {
        const expressions = conditionGroup.children // li elements
        const simpleFilters = []
        for (let i = 0; i < expressions.length; i++) {
          simpleFilters.push(extractFilter(expressions[i]))
        }

        // console.log("simple filters before factory");
        const complexFilter = filterFactory(simpleFilters, operator)
        return complexFilter
      } else {
        return extractFilter(filterRoot)
      }
    }
  }

  const filterRoot = document.querySelector(".expression")
  const resultFilter = findFilter(filterRoot)

  urlFromStorage = await getFromStorage('buLink')
  retrieveRowCount(resultFilter, deNameFromStorage, filterKeyFromStorage, urlFromStorage)


}

const collectData = () => {
  let filterObject = {
    DEname: '',
    filterKey: ''
  }

  try {
    if (!document.querySelectorAll('.ft-filter-preview-source')[0]) {
      chrome.storage.sync.get('DEname', function (res) {
        filterObject.DEname = res.DEname
      })
    } else {
      DEname = document.querySelectorAll('.ft-filter-preview-source')[0].textContent
      chrome.storage.sync.set({
        DEname,
      }, () => deNameFromStorage = DEname)
    }
    if (!document.querySelectorAll('.carb-pop-input')[2]) {
      chrome.storage.sync.get('fitlerKey', function (res) {
        filterObject.filterKey = res.fitlerKey
      })
    } else {
      filterKey = document.querySelectorAll('.carb-pop-input')[2].value
      chrome.storage.sync.set({
        filterKey,
      }, () => filterKeyFromStorage = filterKey)
    }
  } catch (e) {
    console.log('failed collect data', e)
  }
}



const filterButton = document.createElement('button')
filterButton.id = 'filterButton'
filterButton.onclick = sendFilter
filterButton.innerHTML = 'Run Filter'
filterButton.style.cssText = 'font-size: 12px; height: 26px; margin-right: 10px; '
filterButton.classList.add('btn', 'btn-primary', 'btn-large')

const filterContainer = document.createElement('div')
filterContainer.style.cssText = 'display: flex; justify-content: center; z-index: 999; position: relative; width: 30%; margin-left: 35%;'
filterContainer.id = 'filterContainer'
filterContainer.appendChild(filterButton)

chrome.storage.sync.set({buName: null}, console.log('BU name cleaned'))

setInterval(async () => {
  const headerContainer = document.querySelector('.op-head')

  const editFilterPage = document.querySelector('.filter-text-heading')
  const filterOverviewPage = document.querySelector('.ft-filter-preview-source')
  const headerInEdit = document.querySelector('.expressions-wrap')
  const container = document.querySelector('#filterContainer')

  const activeBUName = document.querySelector('.mc-header-accounts .value')

  if (activeBUName) {
  
    let BUNameFromStorage = await getFromStorage('buName')
    
    if (BUNameFromStorage  != activeBUName.textContent) {
      chrome.storage.sync.set({
        buName: activeBUName.textContent
      })
      console.log('updated buName', activeBUName.textContent, BUNameFromStorage )
    }

  }

  if ((editFilterPage || filterOverviewPage) && container) {

  } else if (filterOverviewPage) {
    headerContainer.appendChild(filterContainer)
    collectData()
  } else if (editFilterPage) {
    headerInEdit.appendChild(filterContainer)
  } else {
    filterContainer.remove()
  }

}, 1000)


