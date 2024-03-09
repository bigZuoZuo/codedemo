export const priceRemoveFloat = function (priceNumber: number | string, total: number) {
  const price = Number(priceNumber)
  if (price !== price) {
    return ''
  }

  var fixedValue = (price * total).toFixed(2)
  var length = fixedValue.length
  while (length !== 0) {
    var index = length - 1
    var element = fixedValue[index]
    length = length - 1
    if (element === '0') {
      fixedValue = fixedValue.substring(0, index)
      continue
    }
    if (element === '.') {
      fixedValue = fixedValue.substring(0, index)
      return fixedValue
    }

    if (element !== '0') {
      return fixedValue
    }
  }
  return fixedValue
}
