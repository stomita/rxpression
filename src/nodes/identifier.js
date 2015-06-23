'use strict';

import RxNode from './rxnode';

/**
 *
 */
export default class Identifier extends RxNode {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config, options) {
    super(options);
    this.name = config.name;
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  _evaluate(context) {
    return RxNode.toObservable(context).filter(ctx => {
      return ctx;
    }).flatMap(ctx => {
      var value = ctx[this.name];
      return RxNode.toObservable(value);
    });
  }

}
