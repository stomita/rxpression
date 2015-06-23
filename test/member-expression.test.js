'use strict';

import assert from 'power-assert';

import Rx from 'rx';
import Promise from 'promise';
import Rxpression from '../src/rxpression';

describe('member-expression', () => {

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

});
