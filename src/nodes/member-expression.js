'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

/**
 *
 */
export default class MemberExpression {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config) {
    this.computed = config.computed;
    this.object = RxNode.build(config.object);
    this.property = RxNode.build(config.property);
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
        return object[property];
      }
    );
  }

}
