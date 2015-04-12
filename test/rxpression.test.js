'use strict';

import assert from 'power-assert';

import Rx from 'rx';
import Promise from 'promise';
import Rxpression from '../src/rxpression';

describe('rxpression', () => {

  it('should get context information', (done) => {
    var rxpr = new Rxpression('a');
    var context = { a : { b : 2 } };
    rxpr.evaluate(context).take(1).subscribe( (a) => {
      assert(a.b === 2);
    }, done, done);
  });

  it('should calc from context', (done) => {
    var rxpr = new Rxpression('a * b + 4');
    var context = { a : 2, b : 4 };
    rxpr.evaluate(context).take(1).subscribe( (ret) => {
      assert(ret === 12);
    }, done, done);
  });

  it('should get stream result from observable/promise variable', (done) => {
    var rxpr = new Rxpression('a * b + c - 4');
    var context = {
      a : Rx.Observable.interval(200).map( (i) => i + 1 ), // 1, 2, 3, 4, 5 ....
      b : new Promise( (resolve, reject) => setTimeout( () => resolve(5), 100) ), // 5
      c : 3
    };
    rxpr.evaluate(context).take(4).toArray().subscribe( (ret) => {
      assert.deepEqual(ret, [ 4, 9, 14, 19 ]);
    }, done, done);
  });

  it('should access to property', (done) => {
    var rxpr = new Rxpression('b["name"] + \' = \' + a[b.name]');
    var context = {
      a : { prop1: 1, prop2: 2 },
      b : new Promise.resolve({ name: 'prop1' }),
    };
    rxpr.evaluate(context).subscribe( (ret) => {
      assert(ret === 'prop1 = 1');
    }, done, done);
  });

  it('should construct array', (done) => {
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

  it('should initialize object', (done) => {
    var rxpr = new Rxpression('({ "Full Name": contact.firstName + \' \' + contact.lastName, Age: contact.age + 1  })');
    var context = {
      contact: new Promise.resolve({ firstName: 'John', lastName: 'Doe', age: 21 })
    };
    rxpr.evaluate(context).subscribe( (ret) => {
      assert.deepEqual(ret, { "Full Name": "John Doe", Age: 22 });
    }, done, done);
  });

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
      c: Rx.Observable.interval(250).map((i) => i+1).startWith(0).map((i)=>'c: '+i).delay(0).publish()
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
      c : Rx.Observable.interval(400).map((i) => i % 2 === 0 ? 'n' : 'y').startWith('y').delay(0).publish()
    };
    rxpr.evaluate(context).take(5).toArray().subscribe( (rets) => {
      assert.deepEqual(rets, [ true, 'n', 0, 'y', true]);
    }, done, done);
    context.a.connect();
    context.b.connect();
    context.c.connect();
  });


  it('should call function', (done) => {
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
