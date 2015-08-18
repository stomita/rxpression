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
   * @param {Object} cache
   * @returns {Observable}
   */
  evaluateMember(context, cache) {
    var object = this.object.evaluate(context, cache);
    var property = this.computed ? this.property.evaluate(context, cache) : Rx.Observable.just(this.property.name);
    return Rx.Observable.combineLatest(object, property, (object, property) => {
      return RxNode.toObservable(object[property]).map(p => {
        return { object: object, property: p };
      });
    }).flatMap(ret => ret);
  }

  /**
   * @param {Observable} context
   * @param {Object} cache
   * @returns {Observable}
   */
  _evaluate(context, cache) {
    return this.evaluateMember(context, cache).map(ret => ret.property);
  }

}
