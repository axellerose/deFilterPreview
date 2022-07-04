// const allInFilter = document.querySelectorAll('.expression-text > .ft-grouping > *')

// allInFilter.forEach(element => {
//   filterObject.filterText.push(element.textContent)
//   chrome.storage.sync.set({ filterText: filterObject.filterText })
// })

// var filter = {
//   leftOperand: {
//     Property: "",
//     SimpleOperator: "",
//     Value: null
//   },
//   LogicalOperator: "",
//   RightOperand: {

//   }
// }


// ========================================================================================
var allInFilter = document.querySelectorAll('.expression-text > .ft-grouping > *')
var filterElements = []
var filterObjectsArray = []

allInFilter.forEach(element => {
  filterElements.push(element)
})

filterElements.forEach(element => {
  let filter = {}
  if (element.childElementCount > 0) {
    filter.Property = element.children[0].innerText
    filter.SimpleOperator = element.children[1].innerText
    filter.Value = element.children[2].innerText || undefined
    filterObjectsArray.push(filter)
  } else if (element.childElementCount === 0) {
    filter = {
      LogicalOperator: "OR"
    }
    filterObjectsArray.push(filter)
  }
})




const iterate = () => {

}