'use strict';

import assert from 'power-assert';

import Rx from 'rx';
import Promise from 'promise';
import Rxpression from '../src/rxpression';

describe('conditional-expression', () => {

  it('should branch with conditionally', (done) => {
    /*
    t: 000 --- 010 --- 020 --- 030 --- 040 --- 050 --- 060 --- 070 --- 080 --- 090 --- 100 --- 110 --- 120 --- 130 --- 140 --- 150
    a:              T ------------------------------------> F ------------------------------------> T ---------------------------
    b:                                      0 --------------------> 1 --------------------> 2 --------------------> 3 -----------
    c:  0 ----------------> 1 ----------------> 2 ----------------> 3 ----------------> 4 ----------------> 5 ----------------> 6
    */
    var rxpr = new Rxpression('a ? b : c');
    var context = {
      a: Rx.Observable.interval(500).map((i) => i % 2 === 1).startWith(true).delay(150).publish(),
      b: Rx.Observable.interval(300).map((i) => i+1).startWith(0).map((i)=>'b: '+i).delay(450).publish(),
      c: Rx.Observable.interval(250).map((i) => i+1).startWith(0).map((i)=>'c: '+i).delay(0).publish(),
    };
    rxpr.evaluate(context).take(6).toArray().subscribe((rets) => {
      assert.deepEqual(rets, [
        'b: 0',
        'c: 2',
        'c: 3',
        'c: 4',
        'b: 2',
        'b: 3'
      ]);
    }, done, done);
    context.a.connect();
    context.b.connect();
    context.c.connect();
  });

});
