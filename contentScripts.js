const retrieveRowCount = (filter) => {
  console.log('filter key:', filter)
  // const filter = "542E2810-D765-4029-8373-AC3DF7D09713";

  fetch(`https://timer-extension.ngrok.io/rows?filter=${filter}`)
    .then(response => response.json())
    .then(data => {
      const { RowCount } = data
      console.log(RowCount)
      document.querySelector('#filterInput').value = RowCount
    })
    .catch(error => console.error(JSON.stringify(error)))
}

const sendFilter = () => {
  console.log('send filter func')
  // let data
  // chrome.storage.sync.get(null, function (items) {
  //   var allKeys = Object.keys(items)
  //   var allValues = Object.values(items)
  //   data = allValues[1]
  //   console.log(allValues[2])
  //   retrieveRowCount(data)
  // })

  const filter = () => ({
    LeftOperand: {},
    LogicalOperator: "",
    RightOperand: {},
  })

  const operand = () => ({
    Property: "",
    SimpleOperator: "",
    Value: undefined,
  })

  function extractFilter(root) {
    const conditionHandler = root.querySelector(".expressioneer-handle")

    // console.log("extracting", conditionHandler);
    if (conditionHandler) {
      const property = conditionHandler.querySelector(".expressioneer-condition-name").innerText
      const operator = conditionHandler.querySelector(".expressioneer-condition-operators").innerText
      const value = conditionHandler.querySelector(".expressioneer-condition-value").innerText

      const op = operand()

      op.Property = property
      op.SimpleOperator = operator
      op.Value = value

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

  console.log(filterRoot)

  const resultFilter = findFilter(filterRoot)
  console.log(resultFilter)
}

const collectData = () => {

  let filterObject = {
    DEname: '',
    filterKey: '',
    filterText: []
  }

  chrome.storage.sync.get('filterText', function (res) {
    filterObject.filterText = res.filterText
  })

  try {

    if (!document.querySelectorAll('.ft-filter-preview-source')[0]) {
      chrome.storage.sync.get('DEname', function (res) {
        filterObject.DEname = res.DEname
      })
    } else {
      DEname = document.querySelectorAll('.ft-filter-preview-source')[0].textContent
      chrome.storage.sync.set({
        DEname,
      }, () => console.log('de name set to storage: ', DEname))
    }

    if (!document.querySelectorAll('.carb-pop-input')[2]) {
      chrome.storage.sync.get('fitlerKey', function (res) {
        filterObject.filterKey = res.fitlerKey
      })
    } else {
      filterKey = document.querySelectorAll('.carb-pop-input')[2].value
      chrome.storage.sync.set({
        filterKey,
      }, () => console.log('filter key set to storage: ', filterKey))
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

const filterInput = document.createElement('input')
filterInput.id = 'filterInput'
filterInput.type = 'text'
filterInput.style.cssText = 'font-size: 12px; color: #000;border: 1px solid #D6D6D6;padding: 1px 3px;border-radius: 6px; margin-top: 3px;'
filterInput.placeholder = 'Filter key'

const filterOutput = document.createElement('h2')
filterOutput.id = 'filterOutput'
filterOutput.style.cssText = 'color: #e73e73;'
filterOutput.textContent = ''

const filterContainer = document.createElement('div')
filterContainer.style.cssText = 'display: flex; justify-content: center; z-index: 999; position: relative; width: 30%; margin-left: 35%;'

filterContainer.id = 'filterContainer'
filterContainer.appendChild(filterButton)
filterContainer.appendChild(filterOutput)
filterContainer.appendChild(filterInput)



setInterval(() => {
  const headerContainer = document.querySelector('.op-head')

  const editFilterPage = document.querySelector('.filter-text-heading')
  const filterOverviewPage = document.querySelector('.ft-filter-preview-source')
  const headerInEdit = document.querySelector('.expressions-wrap')

  const container = document.querySelector('#filterContainer')

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
