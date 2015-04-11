'use strict';

import RxNode from './rxnode';

/**
 *
 */
export default class ExpressionStatement extends RxNode {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config, options) {
    super(options);
    this.expression = RxNode.build(config.expression, options);
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  evaluate(context) {
    return this.expression.evaluate(context);
  }

}
