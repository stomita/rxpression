'use strict';

import assert from 'power-assert';

import Rx from 'rx';
import Promise from 'promise';
import Rxpression from '../src/rxpression';

describe('logical-expression', () => {

  it('should calculate logical operator', (done) => {
    /*
    t: 000 --- 010 --- 020 --- 030 --- 040 --- 050 --- 060 --- 070 --- 080 --- 090 --- 100 --- 110 --- 120 --- 130 --- 140 --- 150
    a:  T ------------------------------------> F ------------------------------------> T ------------------------------------- F
    b:              0 ------------> 1 ------------> 2 ------------> 0 ------------> 1 ------------> 2 ------------> 1 -----------
    c:  y ----------------------------> n ----------------------------> y ----------------------------> n -----------------------
    */
    var rxpr = new Rxpression('a || b && c');
    var context = {
      a : Rx.Observable.interval(500).map((i) => i % 2 === 1).startWith(true).delay(0).publish(),
      b : Rx.Observable.interval(200).map((i) => (i+1) % 3).startWith(0).delay(150).publish(),
      c : Rx.Observable.interval(400).map((i) => i % 2 === 0 ? 'n' : 'y').startWith('y').delay(0).publish(),
    };
    rxpr.evaluate(context).take(5).toArray().subscribe( (rets) => {
      assert.deepEqual(rets, [ true, 'n', 0, 'y', true]);
    }, done, done);
    context.a.connect();
    context.b.connect();
    context.c.connect();
  });

});
