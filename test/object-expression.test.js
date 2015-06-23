'use strict';

import assert from 'power-assert';

import Rx from 'rx';
import Promise from 'promise';
import Rxpression from '../src/rxpression';

describe('object-expression', () => {

  it('should initialize object', (done) => {
    var rxpr = new Rxpression('({ "Full Name": contact.firstName + \' \' + contact.lastName, Age: contact.age + 1  })');
    var context = {
      contact: new Promise.resolve({ firstName: 'John', lastName: 'Doe', age: 21 })
    };
    rxpr.evaluate(context).subscribe( (ret) => {
      assert.deepEqual(ret, { "Full Name": "John Doe", Age: 22 });
    }, done, done);
  });

});
