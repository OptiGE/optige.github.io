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
    request.open('GET', `http://api.exchangeratesapi.io/v1/convert?access_key=f39af0e5c46ee51ef37a8eda09e492a0&from=${fromCurrency}&to=${toCurrency}&amount=1`, false)
    request.open('GET', `https://v2.api.forex/rates/latest.json?beautify=true&from=${fromCurrency}&to=${toCurrency}&key=351e7d5f-8fd5-400a-8374-ef7bee21da95`, false)
    request.send(null)

    console.log(JSON.parse(request.responseText))

    if (request.status === 200) {
      const json = JSON.parse(request.responseText)
      console.log(json)
      try {
        const rate = parseFloat(json.rates[this.currName2]) //Lol så helt utan flit visar det sig att json.rates faktiskt är ett bibliotek för att göra just detta
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
