'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

let BINARY_OPERATIONS = {
  "+":   (a, b) => a + b,
  "-":   (a, b) => a - b,
  "*":   (a, b) => a * b,
  "/":   (a, b) => a / b,
  "%":   (a, b) => a % b,
  "==":  (a, b) => a == b,
  "===": (a, b) => a === b,
  "!=":  (a, b) => a != b,
  "!==":  (a, b) => a !== b,
  ">":   (a, b) => a > b,
  ">=":  (a, b) => a >= b,
  "<":   (a, b) => a < b,
  "<=":  (a, b) => a <= b,
  "|":   (a, b) => a | b,
  "&":   (a, b) => a & b,
  "^":   (a, b) => a ^ b,
  "<<":  (a, b) => a << b,
  ">>":  (a, b) => a >> b,
  ">>>": (a, b) => a >>> b,
  "in":  (a, b) => a in b,
  "instanceof": (a, b) => a instanceof b,
};


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
    if (!BINARY_OPERATIONS[this.operator]) {
      var error = new Error('Specified binary operator is not allowed: '+ this.operator);
      if (config.loc) {
        error.lineNumber = config.loc.start.line;
        error.column = config.loc.start.column;
      }
      throw error;
    }
    this.left = RxNode.build(config.left, options);
    this.right = RxNode.build(config.right, options);
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  _evaluate(context, cache) {
    var operation = BINARY_OPERATIONS[this.operator];
    return Rx.Observable.combineLatest(
      this.left.evaluate(context, cache),
      this.right.evaluate(context, cache),
      operation
    );
  }

}
