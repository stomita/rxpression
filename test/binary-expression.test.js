'use strict';

import assert from 'power-assert';

import Rx from 'rx';
import Promise from 'promise';
import Rxpression from '../src/rxpression';

describe('binary-expression', () => {

  it('should calculate by plus operator', (done) => {
    var rxpr = new Rxpression('a + b');
    var context = { a: 1, b: 2 }
    rxpr.evaluate(context).take(1).subscribe((ret) => {
      assert(ret === 3);
    }, done, done);
  });

  it('should calculate by minus operator', (done) => {
    var rxpr = new Rxpression('a - b');
    var context = { a: 1, b: 2 }
    rxpr.evaluate(context).take(1).subscribe((ret) => {
      assert(ret === -1);
    }, done, done);
  });

  it('should calculate by multiple operator', (done) => {
    var rxpr = new Rxpression('a * b');
    var context = { a: 1, b: 2 }
    rxpr.evaluate(context).take(1).subscribe((ret) => {
      assert(ret === 2);
    }, done, done);
  });

  it('should calculate by divide operator', (done) => {
    var rxpr = new Rxpression('a / b');
    var context = { a: 1, b: 2 }
    rxpr.evaluate(context).take(1).subscribe((ret) => {
      assert(ret === 0.5);
    }, done, done);
  });

  it('should calculate combined operator', (done) => {
    var rxpr = new Rxpression('a * b + 4');
    var context = { a : 2, b : 4 };
    rxpr.evaluate(context).take(1).subscribe( (ret) => {
      assert(ret === 12);
    }, done, done);
  });

  it('should calculate streamed result from observable/promise variable', (done) => {
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

});
