'use strict';

import esprima from 'esprima';
import Rx from 'rx';

import RxNode from './nodes/rxnode';

/**
 *
 */
export default class Rxpression {

  /**
   * @param {String} expr - Expression string to be parsed and evaluated in Rx way
   */
  constructor(expr) {
    var tree = esprima.parse(expr);
    this._node = RxNode.build(tree.body[0]);
    return this;
  }

  /**
   * @param {Observable|Object>} context - An observable object which provides evaluation context
   * @returns {Observable}
   */
  evaluate(context) {
    context = RxNode.toObservable(context);
    return this._node.evaluate(context);
  }

};
