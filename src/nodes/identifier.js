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
   * @private
   */
  _findCacheKey() {
    return this.name;
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  _evaluate(context, cache) {
    return RxNode.toObservable(context).filter(ctx => {
      return ctx;
    }).flatMapLatest(ctx => {
      var value = ctx[this.name];
      return RxNode.toObservable(value);
    });
  }

}
