'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

var plus = (a, b) => a + b;
var minus = (a, b) => a - b;
var multiple = (a, b) => a * b;
var divide = (a, b) => a / b;
var mod = (a, b) => a % b;

/**
 *
 */
export default class BinaryExpression extends RxNode {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config, options) {
    super(options);
    this.operator = config.operator;
    this.left = RxNode.build(config.left, options);
    this.right = RxNode.build(config.right, options);
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  evaluate(context) {
    var operation =
      this.operator === "+" ? plus :
      this.operator === "-" ? minus :
      this.operator === "*" ? multiple :
      this.operator === "/" ? divide:
      this.operator === "%" ? mod :
      null;
    return Rx.Observable.combineLatest(
      this.left.evaluate(context),
      this.right.evaluate(context),
      operation
    );
  }

}
