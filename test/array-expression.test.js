'use strict';

import assert from 'power-assert';

import Rx from 'rx';
import Promise from 'promise';
import Rxpression from '../src/rxpression';

describe('array-expression', () => {

  it('should construct array', (done) => {
    var rxpr = new Rxpression('[a, b, c]');
    var context = { a : 1, b: 2, c: 3 };
    rxpr.evaluate(context).take(1).subscribe( (arr) => {
      assert.deepEqual(arr, [ 1, 2, 3 ]);
    }, done, done);
  });

  it('should construct array from observable', (done) => {
    var rxpr = new Rxpression('[a, b, c]');
    var context = {
      a: 1,
      b: 2,
      c: Rx.Observable.of(1, 2, 3)
    };
    rxpr.evaluate(context).take(3).toArray().subscribe((rets) => {
      assert.deepEqual(rets, [
        [ 1, 2, 1 ],
        [ 1, 2, 2 ],
        [ 1, 2, 3 ]
      ]);
    }, done, done);
  });

});
