'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

let UNARY_OPERATIONS = {
  "+": (a) => +a,
  "-": (a) => -a,
  "!": (a) => !a,
  "~": (a) => ~a
};

/**
 *
 */
export default class UnaryExpression extends RxNode {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config, options) {
    super(options);
    this.operator = config.operator;
    if (!UNARY_OPERATIONS[this.operator]) {
      var error = new Error('Specified unary operator is not allowed: '+ this.operator);
      if (config.loc) {
        error.lineNumber = config.loc.start.line;
        error.column = config.loc.start.column;
      }
      throw error;
    }
    this.prefix = config.prefix;
    this.argument = RxNode.build(config.argument, options);
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  evaluate(context) {
    var operation = UNARY_OPERATIONS[this.operator];
    return this.argument.evaluate(context).map(operation);
  }

}
