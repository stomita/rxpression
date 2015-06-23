'use strict';

import assert from 'power-assert';

import Rx from 'rx';
import Promise from 'promise';
import Rxpression from '../src/rxpression';

describe('call-expression', () => {

  it('should call function', (done) => {
    var rxpr = new Rxpression('func(a, b)');
    var context = { a: 1, b: 2, func: (x, y) => x + y + 1 };
    rxpr.evaluate(context).take(1).subscribe( (ret) => {
      assert(ret === 4);
    }, done, done);
  });

  it('should call function with observable', (done) => {
    var rxpr = new Rxpression('a.func(b)');
    var context = {
      a : Promise.resolve({
            func : Rx.Observable.interval(150).map((i) => (t) => `Func${i+1}: ${t}`)
          }),
      b : Rx.Observable.interval(200)
    };
    rxpr.evaluate(context).take(4).toArray().subscribe( (rets) => {
      assert.deepEqual(rets, [ 'Func1: 0', 'Func2: 0', 'Func2: 1', 'Func3: 1' ]);
    }, done, done);
  });

});
