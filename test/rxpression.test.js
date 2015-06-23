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

});
