'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

/**
 *
 */
export default class ConditionalExpression extends RxNode {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config, options) {
    super(options);
    this.test = RxNode.build(config.test, options);
    this.consequent = RxNode.build(config.consequent, options);
    this.alternate = RxNode.build(config.alternate, options);
  }

  /**
   * @param {Observable} context
   * @param {Object} cache
   * @returns {Observable}
   */
  _evaluate(context, cache) {
    let testResult = this.test.evaluate(context, cache);
    let testNegate = testResult.map((t) => !t);
    return Rx.Observable.merge(
      this.consequent.evaluate(context, cache)
        .pausableBuffered(testResult)
        .debounce(1)
      ,
      this.alternate.evaluate(context, cache)
        .pausableBuffered(testNegate)
        .debounce(1)
    );
  }

}
