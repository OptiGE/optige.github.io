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

async getExchangeRate(fromCurrency, toCurrency) {
  const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
  const data = await response.json();
  return data.rates[toCurrency];
}

async updateCurrencyRates() {
  let rate = 0
  rate = 0.0969
  rate = await this.getExchangeRate(this.currName1, this.currName2)
  //alert(rate)
  

  this[this.currName1 + 'to' + this.currName2] = (rate).toPrecision(5)
  this[this.currName2 + 'to' + this.currName1] = (1.0 / rate).toPrecision(5)
  console.log(rates)
  refreshScreen()
}
}