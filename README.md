# Rxpression

[![Build Status](https://travis-ci.org/stomita/rxpression.svg)](https://travis-ci.org/stomita/rxpression)

A simple [Reactive Extension](https://github.com/Reactive-Extensions/RxJS) combinator using a JavaScript-subset expression language


## Usage

### Simle calculation

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
