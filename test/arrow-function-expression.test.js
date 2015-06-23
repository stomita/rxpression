'use strict';

import assert from 'power-assert';

import Rx from 'rx';
import Promise from 'promise';
import Rxpression from '../src/rxpression';

describe('arrow-function-expression', () => {

  it('should construct function from arrow definition', (done) => {
    var rxpr = new Rxpression('() => 123');
    var context = {}
    rxpr.evaluate(context).take(1).subscribe((fn) => {
      assert(fn() === 123);
    }, done, done);
  });

  it('should accept arrow function', (done) => {
    var rxpr = new Rxpression('arr.map(a => fun(a) + 1)');
    var context = {
      arr: Rx.Observable.of(
        [1, 2, 3],
        [1, 2, 3, 4],
        [1, 2, 3, 5, 6]
      ),
      fun: function(a) {
        return Rx.Observable.of(a*2).delay(100);
      }
    };
    rxpr.evaluate(context).take(3).toArray().subscribe( (rets) => {
      assert.deepEqual(rets, [
        [3, 5, 7],
        [3, 5, 7, 9],
        [3, 5, 7, 11, 13]
      ]);
    }, done, done);
  });

});
