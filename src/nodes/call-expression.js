'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

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
    var callee = this.callee.evaluate(context);
    var args = this.arguments.map((arg) => arg.evaluate(context));
    return Rx.Observable.combineLatest(callee, ...args, (callee, ...args) => {
      var ret = callee.apply(null, args);
      return RxNode.toObservable(ret);
    }).flatMap((ret) => ret);
  }

}
