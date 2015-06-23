'use strict';

import assert from 'power-assert';

import Rx from 'rx';
import Promise from 'promise';
import Rxpression from '../src/rxpression';

describe('unary-expression', () => {

  it('should evaluate unary plus operation', (done) => {
    var rxpr = new Rxpression('+a');
    var context = {
      a : Rx.Observable.of(false, 0, 1, true, "", "a")
    };
    rxpr.evaluate(context).take(6).toArray().subscribe(rets => {
      assert.deepEqual(rets.slice(0, 5), [ 0, 0, 1, 1, 0 ])
      assert(isNaN(rets[5]));
    }, done, done);
  });

  it('should evaluate unary minus operation', (done) => {
    var rxpr = new Rxpression('-a');
    var context = {
      a : Rx.Observable.of(false, 0, 1, true, "", "a")
    };
    rxpr.evaluate(context).take(6).toArray().subscribe(rets => {
      assert.deepEqual(rets.slice(0, 5), [ 0, 0, -1, -1, 0 ]);
      assert(isNaN(rets[5]));
    }, done, done);
  });

  it('should evaluate negate operation', (done) => {
    var rxpr = new Rxpression('!a');
    var context = {
      a : Rx.Observable.of(false, 0, 1, true, "", "a")
    };
    rxpr.evaluate(context).take(6).toArray().subscribe(rets => {
      assert.deepEqual(rets, [ true, true, false, false, true, false ]);
    }, done, done);
  });

});
