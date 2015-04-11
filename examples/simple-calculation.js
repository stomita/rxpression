var Rx = require('rx');
var Rxpression = require('../');

var rxpr = new Rxpression('a * b - 1');
var context = {
  a: new Rx.Observable.interval(1000).map(function(i) { return i+1; }),
  b: 2
};
rxpr.evaluate(context).take(4).subscribe(function(result) {
  console.log(result); // 1, 3, 5, 7, ...
});
