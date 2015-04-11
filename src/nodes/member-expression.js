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
  evaluateMember(context) {
    var object = this.object.evaluate(context);
    var property = this.computed ? this.property.evaluate(context) : Rx.Observable.just(this.property.name);
    return Rx.Observable.combineLatest(object, property, (object, property) => {
      return RxNode.toObservable(object[property]).map(p => {
        return { object: object, property: p };
      });
    }).flatMap(ret => ret);
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  evaluate(context) {
    return this.evaluateMember(context).map(ret => ret.property);
  }

}
