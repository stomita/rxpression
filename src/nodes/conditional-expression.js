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
  evaluate(context) {
    return Rx.Observable.combineLatest(
      this.test.evaluate(context),
      this.consequent.evaluate(context),
      this.alternate.evaluate(context),
      (testResult, consequentResult, alternateResult) => {
        return testResult ? consequentResult : alternateResult;
      }
    ).distinctUntilChanged();
  }

}
