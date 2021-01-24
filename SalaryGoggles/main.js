let rates
let sBoxController

// Entry point
window.onload = function () {
  rates = new currencyRate('USD', 'SEK')
  sBoxController = new salaryBoxController(
    [
      new salaryBox('YearSEK', 0, YS => YS / 12),
      new salaryBox('MonthSEK', 0, MS => MS * rates.SEKtoUSD),
      new salaryBox('MonthUSD', 0, MU => MU * 12),
      new salaryBox('YearUSD', 0, YU => YU * rates.USDtoSEK)
    ]
  )
  refreshScreen()
}

function refreshScreen () {
  element('SEKRate').innerHTML = `🇸🇪 <span style="font-size:18px">= ${rates.SEKtoUSD} USD</span>`
  element('USDRate').innerHTML = `🇺🇸 <span style="font-size:18px">= ${rates.USDtoSEK} SEK</span>`

  sBoxController.salaryBoxes.getAll().forEach(sBox => {
    sBox.element.value = prettyPrint(sBox.value)
  })
}

function element (name) {
  return document.getElementById(name)
}

// Prettyprint stuff below

function prettyPrint (num) {
  const presicion = element('presicionSlider').value
  return formatter(presice(num, presicion))
}

function formatter (num) {
  leftSideBackwards = parseInt(num).toString().split('').reverse()
  rightSide = num % 1
  if (rightSide != 0) {
    rightSide = '.' + parseInt(rightSide * 100)
  } else {
    rightSide = ''
  }

  const spacer = ' '

  formattedLeftSide = []
  for (let i = 0; i < leftSideBackwards.length; i++) {
    if (i % 3 == 0 && i != 0) {
      formattedLeftSide.push(spacer)
    }

    formattedLeftSide.push(leftSideBackwards[i])
  }

  return formattedLeftSide.reverse().join('') + rightSide
}

function presice (num, presicion = 0) {
  if (presicion == 0) {
    return Math.round(num / 1000) * 1000
  } else if (presicion == 1) {
    return parseInt(num)
  } else {
    return num.toFixed(2)
  }
}
