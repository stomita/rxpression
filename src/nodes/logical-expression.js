'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

var orOp = (a, b) => a || b;
var andOp = (a, b) => a && b;

/**
 *
 */
export default class LogicalExpression {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config) {
    this.operator = config.operator;
    this.left = RxNode.build(config.left);
    this.right = RxNode.build(config.right);
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  evaluate(context) {
    var operation =
      this.operator === "||" ? orOp :
      this.operator === "&&" ? andOp :
      null;
    return Rx.Observable.combineLatest(
      this.left.evaluate(context),
      this.right.evaluate(context),
      operation
    ).distinctUntilChanged();
  }

}
