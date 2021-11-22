// Calculate a basic arithmetic expression, in the form of "1 + ( ( 3 x 7 ) / 5 ) / 5",
// with each step separated by a whitespace and given as a string.

const doOperation = (left, right, operator) => {
  if (operator === '/') return Number(left) / Number(right)
  if (operator === 'x') return Number(left) * Number(right)
  if (operator === '+') return Number(left) + Number(right)
  if (operator === '-') return Number(left) - Number(right)
}

const calculateEndResult = (expr) => {
  let result = expr[0]
  for (let i = 1; i < expr.length; i++) {
    if ('+-'.includes(expr[i])) {
      result = doOperation(result, expr[i + 1], expr[i])
    }
  }
  return result
}

const calculateRecursive = (expr, count, message) => {
  const printStep = (expr, printMessage) => {
    console.log(`step ${count}: ${message}: ${printMessage}: ${expr.join(' ')}`)
  }
  printStep(expr, 'parent')
  // first check for parentheses - check for the farthest parentheses first
  for (let i = expr.length; i > -1; i--) {
    if (expr[i] !== '(') continue
    for (let x = i; x < expr.length; x++) {
      if (expr[x] === ')') {
        const parenthesis = expr.splice(i, x - i + 1).filter(e => !'()'.includes(e))
        const result = calculateRecursive(parenthesis, ++count, 'parenthesis')
        expr.splice(i, 0, result)
        printStep(parenthesis, 'parenthesis')
      }
    }
  }
  // then check for multiplications or divisions
  for (let i = 0; i < expr.length; i++) {
    if ('/x'.includes(expr[i])) {
      printStep(expr, 'mults')
      const result = doOperation(expr[i - 1], expr[i + 1], expr[i])
      expr.splice(i - 1, 3)
      expr.splice(i - 1, 0, result)
      calculateRecursive(expr, ++count, 'mults and divs')
    }
  }
  // finally return the end result when there are only adds or subtracts left
  return calculateEndResult(expr)
}
const expressionArray = process.argv.splice(2)[0].split(' ')
const result = calculateRecursive(expressionArray, 1, 'start')
console.log(`end result: ${result}`)
