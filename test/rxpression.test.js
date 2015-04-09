'use strict';

import assert from 'power-assert';

import Rx from 'rx';
import Promise from 'promise';
import Rxpression from '../';

describe('rxpression', () => {

  it('should get context information', (done) => {
    var rxpr = new Rxpression('a');
    var context = { a : { b : 2 } };
    rxpr.evaluate(context).take(1).subscribe( (a) => {
      assert(a.b === 2);
      done();
    }, done);
  });

  it('should calc from context', (done) => {
    var rxpr = new Rxpression('a * b + 4');
    var context = { a : 2, b : 4 };
    rxpr.evaluate(context).take(1).subscribe( (ret) => {
      assert(ret === 12);
      done();
    }, done);
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

});
