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
   * @returns {Observable}
   */
  _evaluate(context) {
    let testResult = this.test.evaluate(context);
    let testNegate = testResult.map((t) => !t);
    return Rx.Observable.merge(
      this.consequent.evaluate(context)
        .pausableBuffered(testResult)
        .debounce(1)
      ,
      this.alternate.evaluate(context)
        .pausableBuffered(testNegate)
        .debounce(1)
    );
  }

}
