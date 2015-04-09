'use strict';

import RxNode from './rxnode';

/**
 *
 */
export default class ExpressionStatement {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config) {
    this.expression = RxNode.build(config.expression);
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  evaluate(context) {
    return this.expression.evaluate(context);
  }

}
