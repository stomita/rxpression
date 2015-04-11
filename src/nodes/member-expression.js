'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

/**
 *
 */
export default class MemberExpression extends RxNode {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config, options) {
    super(options);
    this.computed = config.computed;
    this.object = RxNode.build(config.object, options);
    this.property = RxNode.build(config.property, options);
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  evaluate(context) {
    return Rx.Observable.combineLatest(
      this.object.evaluate(context),
      this.computed ? this.property.evaluate(context) : Rx.Observable.just(this.property.name),
      function(object, property) {
        return RxNode.toObservable(object[property]);
      }
    ).flatMap((ret) => ret);
  }

}
