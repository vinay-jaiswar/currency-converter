'use strict';

$(document).ready(function () {
  $.get('https://restcountries.com/v3.1/all', function (data) {
    data.sort(function (a, b) {
      return a.name.common.localeCompare(b.name.common);
    });

    data.forEach(function (country) {
      var countryName = country.name.common;
      var currencies = country.currencies;
      var currencyValues = [];

      for (const currencyCode in currencies) {
        currencyValues.push(' (' + currencyCode + ')');
      }

      $('.countriesList').append(
        '<option>' + countryName + currencyValues.join(', ') + '</option>'
      );
    });
  }).fail(function () {
    console.error('Failed to fetch countries data.');
  });

  $('.btn-convert').click(function () {
    const fromCurrency = $('#from-currency')
      .val()
      .match(/\((.*)\)/)[1];
    const toCurrency = $('#to-currency')
      .val()
      .match(/\((.*)\)/)[1];
    const amount = $('.from-amount').val();

    $.ajax({
      url: 'https://api.exchangerate-api.com/v4/latest/' + fromCurrency,
      type: 'GET',
      success: function (response) {
        const exchangeRate = response.rates[toCurrency];
        const convertedAmount = (amount * exchangeRate).toFixed(2);
        $('.to-amount').val(convertedAmount);
      },
      error: function () {
        console.error('Failed to fetch exchange rates.');
      },
    });
  });
});
