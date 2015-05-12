# Rxpression

[![Build Status](https://travis-ci.org/stomita/rxpression.svg)](https://travis-ci.org/stomita/rxpression)

A simple [Reactive Extension](https://github.com/Reactive-Extensions/RxJS) combinator using a JavaScript-subset expression language

## Abstract

Rxpression is a Reactive Extension Observable generator using simple JavaScript expression.
The Rxpression instance accepts context information defining variables used in the expression,
yields an Observable stream which emits evaluated result.

If a variable in the context or any intermediate evaluated result is Promise or Observable,
the evaluation is applied to its emitted result.

It enables you to describe dependencies simply, instead of writing Promise chaining or Observable methods, even in asynchronous streaming environment.

## Install

```
$ npm install rxpression
```

## Usage

### Simple Calculation

```javascript
var rxpr = new Rxpression('a * b - 1');
var context = {
  a: new Rx.Observable.interval(1000).map(function(i) { return i+1; }),
  b: 2
};
rxpr.evaluate(context).subscribe(function(result) {
  console.log(result); // 1, 3, 5, 7, ...
});
```

### Ajax with jQuery

```javascript
$('body').html(
  '<select id="state">'+
    '<option>CA</option>'+
    '<option>TX</option>'+
    '<option>OR</option>'+
  '</select>'
);
var stateSelect = $('#state');
var context = {
  listAllCounty: function(state) {
    var url = 'http://api.sba.gov/geodata/county_links_for_state_of/' + state + '.json';
    return $.getJSON(url).promise();
  },
  state: Rx.Observable.fromEvent(stateSelect, 'change')
};

// get count of counties in the selected state in United States
var rxpr = new Rxpression('listAllCounty(state.target.value).length');
rxpr.evaluate(context).subscribe(function(result) {
  console.log('state conties: ', result);
});
```
