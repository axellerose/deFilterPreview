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
          if (next.hasOwnProperty('LeftOperand')) {
            collection[index++] = `<LeftOperand xsi:type="par:ComplexFilterPart">${lookdeep(next)}</LeftOperand>`
          } else {
            collection[index++] = `<LeftOperand xsi:type="par:SimpleFilterPart">${lookdeep(next)}</LeftOperand>`
          }

        } else if (item === 'RightOperand') {
          if (next.hasOwnProperty('RightOperand')) {
            collection[index++] = `<RightOperand xsi:type="par:ComplexFilterPart">${lookdeep(next)}</RightOperand>`
          } else {
            collection[index++] = `<RightOperand xsi:type="par:SimpleFilterPart">${lookdeep(next)}</RightOperand>`
          }

        } else collection[index++] = `<${item}>${lookdeep(next)}</${item}>`
      }
      else collection[index++] = `<${item}>${String(next)}</${item}>`
    }
  }
  return collection.join('')
}

var result = lookdeep(receivedFilter)

console.log('Object converted to String : ' + result)


// TODO:  <ns1:DataFilter xsi:type="par:ComplexFilterPart" xmlns:par="http://exacttarget.com/wsdl/partnerAPI">
//         </ns1:DataFilter>
