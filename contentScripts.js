let deNameFromStorage = ''
let filterKeyFromStorage = ''
const retrieveRowCount = (filter, deName, filterKey) => {

  const data = {
    deName,
    filter,
    filterKey
  }

  fetch(`https://mcqh779j36zt3vg-882q0dpmyqg8.pub.sfmc-content.com/wz4zt4pzs3g`, {
    method: "POST",
    mode: 'cors',
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      const rows = data.postRequestResultObject.rowCount
      document.querySelector('#filterButton').innerHTML = rows
    })
    .catch(error => console.error(JSON.stringify(error)))
}

const sendFilter = () => {

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
  const resultFilter = findFilter(filterRoot)

  retrieveRowCount(resultFilter, deNameFromStorage, filterKeyFromStorage)

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
