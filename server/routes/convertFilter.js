let receivedFilter = {
  LeftOperand: {
    LeftOperand: {
      Property: 'Country',
      SimpleOperator: "is equal to",
      Value: "UK"
    },
    LogicalOperator: "AND",
    RightOperand: {
      Property: "Language",
      SimpleOperator: "is equal to",
      Value: "EN"
    }
  },
  LogicalOperator: "AND",
  RightOperand: {
    Property: "Email Address",
    SimpleOperator: "contains",
    Value: "@mc.sc"
  }
}

const lookdeep = (object) => {
  var collection = [], index = 0, next, item
  for (item in object) {

    if (object.hasOwnProperty(item)) {
      next = object[item]



      if (typeof next == 'object' && next != null) {

        if (item === 'LeftOperand') {

          collection[index++] = `<LeftOperand xsi:type="par:ComplexFilterPart 1">${lookdeep(next)}</LeftOperand>`
        } else if (item === 'RightOperand') {
          collection[index++] = `<RightOperand xsi:type="par:ComplexFilterPart">${lookdeep(next)}</RightOperand>`
        }
      }
      else collection[index++] = `${item}>${String(next)}</${item}>`
    }
  }
  return collection.join(' ')
}

var result = lookdeep(receivedFilter)

console.log('Object converted to String : ' + result)


