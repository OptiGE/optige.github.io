class currencyRate {
  constructor (currName1, currName2) {
    this.currName1 = currName1
    this.currName2 = currName2
    this[currName1] = 0
    this[currName2] = 0
    this[currName1 + 'to' + currName2] = 0
    this[currName2 + 'to' + currName1] = 0

    this.updateCurrencyRates()
  }

  getCurrencyRates (fromCurrency, toCurrency) {
    /*  const response = await fetch(`https://api.exchangeratesapi.io/latest?base=${fromCurrency}&symbols=${toCurrency}`)
      const json = await response.json() */

    const request = new XMLHttpRequest()
    request.open('GET', `https://api.exchangeratesapi.io/latest?base=${fromCurrency}&symbols=${toCurrency}`, false)
    request.send(null)

    if (request.status === 200) {
      const json = JSON.parse(request.responseText)
      try {
        const rate = parseFloat(json.rates[this.currName2])
        return rate
      } catch (err) {
        console.log(err)
        throw `Failed to convert json currency rate to int: ${json.rates[this.currName2]}`
      }
    } else {
      throw 'Bad response: ' + request.status
    }
  }

  updateCurrencyRates () {
    const rate = this.getCurrencyRates(this.currName1, this.currName2)

    this[this.currName1 + 'to' + this.currName2] = (rate).toPrecision(5)
    this[this.currName2 + 'to' + this.currName1] = (1.0 / rate).toPrecision(5)
  }
}
