'use strict';

import Rx from 'rx';
import RxNode from './rxnode';
import MemberExpression from './member-expression';

/**
 *
 */
export default class CallExpression extends RxNode {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config, options) {
    super(options);
    this.callee = RxNode.build(config.callee, options);
    this.arguments = config.arguments.map((arg) => RxNode.build(arg, options));
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  evaluate(context) {
    var callee;
    if (this.callee instanceof MemberExpression) {
      callee = this.callee.evaluateMember(context).map(member => {
        return { object: member.object, fn: member.property };
      });
    } else {
      callee = this.callee.evaluate(context).map(callee => {
        return { object: null, fn: callee };
      });
    }
    var args = this.arguments.map((arg) => arg.evaluate(context));
    return Rx.Observable.combineLatest(callee, ...args, (callee, ...args) => {
      // console.log('callee.object = ', callee.object);
      // console.log('callee.fn = ', callee.fn);
      var ret = callee.fn.apply(callee.object, args);
      return RxNode.toObservable(ret);
    }).flatMap(ret => ret);
  }

}
