'use strict';

import assert from 'power-assert';

import Rx from 'rx';
import Promise from 'promise';
import Rxpression from '../src/rxpression';

const DEBUG_ENABLED = process.env.DEBUG === 'true'

let debug = (name) => (value) => DEBUG_ENABLED && console.log('>>> '+name+':', value);

let publishAndReplay = (o) => {
  let p = o.publish();
  let ret = p.replay(null, 1);
  p.connect();
  ret.connect();
  return ret;
};

Rx.config.longStackSupport = true;

describe('logical-expression', () => {

  it('should calculate and logical operator', (done) => {
    /*
    t: 000 --- 010 --- 020 --- 030 --- 040 --- 050 --- 060 --- 070 --- 080 --- 090 --- 100 --- 110 --- 120 --- 130 --- 140 --- 150
    a:  T ------------------------------------> F ------------------------------------> T ------------------------------------- F
    b:              0 ------------> 1 ------------> 2 ------------> 0 ------------> 1 ------------> 2 ------------> 0 -----------
    */
    let rxpr = new Rxpression('a && b', { debug: DEBUG_ENABLED });
    var context = {
      a : publishAndReplay(Rx.Observable.interval(500).map((i) => i % 2 === 1).startWith(true).delay(0).do(debug('a'))),
      b : publishAndReplay(Rx.Observable.interval(200).map((i) => (i+1) % 3).startWith(0).delay(150).do(debug('b'))),
    };
    rxpr.evaluate(context).take(5).toArray().subscribe( (rets) => {
      assert.deepEqual(rets, [ 0, 1, false, 1, 2 ]);
    }, done, done);
  });

  it('should calculate logical operator', (done) => {
    /*
    t: 000 --- 010 --- 020 --- 030 --- 040 --- 050 --- 060 --- 070 --- 080 --- 090 --- 100 --- 110 --- 120 --- 130 --- 140 --- 150
    a:  T ------------------------------------> F ------------------------------------> T ------------------------------------- F
    b:              0 ------------> 1 ------------> 2 ------------> 0 ------------> 1 ------------> 2 ------------> 1 -----------
    c:  y ----------------------------> n ----------------------------> y ----------------------------> n -----------------------
    */
    let rxpr = new Rxpression('a || b && c', { debug: DEBUG_ENABLED });
    let debug = (name) => (value) => console.log('>>> '+name+':', value);
    let publishAndReplay = (o) => {
      let p = o.publish();
      let ret = p.replay(null, 1);
      p.connect();
      ret.connect();
      return ret;
    };
    var context = {
      a : publishAndReplay(Rx.Observable.interval(500).map((i) => i % 2 === 1).startWith(true).delay(0).do(debug('a'))),
      b : publishAndReplay(Rx.Observable.interval(200).map((i) => (i+1) % 3).startWith(0).delay(150).do(debug('b'))),
      c : publishAndReplay(Rx.Observable.interval(400).map((i) => i % 2 === 0 ? 'n' : 'y').startWith('y').delay(0).do(debug('c')))
    };
    rxpr.evaluate(context).take(5).toArray().subscribe( (rets) => {
      assert.deepEqual(rets, [ true, 'n', 0, 'y', true]);
    }, done, done);
  });

  it('should not evaluate right value when left value is truthy', (done) => {
    var rxpr = new Rxpression('a || b(a)', { debug: DEBUG_ENABLED });
    var called = null;
    var context = {
      a : 1,
      b : (n) => {
        called = n;
        return n;
      }
    };
    rxpr.evaluate(context).take(1).subscribe((ret) => {
      assert(ret === 1);
      assert(called === null);
    }, done, done);
  });

  it('should not evaluate right value when left value is truthy', (done) => {
    var rxpr = new Rxpression('a && b(a)', { debug: DEBUG_ENABLED });
    var called = [];
    var context = {
      a : Rx.Observable.of(false, 0, "", 0, 1, 2),
      b : (n) => {
        called.push(n);
        return n + 1;
      }
    };
    rxpr.evaluate(context).take(6).toArray().subscribe((rets) => {
      assert.deepEqual(rets, [false, 0, "", 0, 2, 3 ]);
      assert.deepEqual(called, [ 1, 2 ]);
    }, done, done);
  });

});
