'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

var orOp = (a, b) => a || b;
var andOp = (a, b) => a && b;

/**
 *
 */
export default class LogicalExpression extends RxNode {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config, options) {
    super(options);
    this.operator = config.operator;
    this.left = RxNode.build(config.left, options);
    this.right = RxNode.build(config.right, options);
  }

  /**
   * @param {Observable} context
   * @param {Object} cache
   * @returns {Observable}
   */
  _evaluate(context, cache) {
    let left = this.left.evaluate(context, cache)
      .do((left) => this.log('Left:', left));
    let right = this.right.evaluate(context, cache)
      .debounce(1) // shareReplay chaining may cause repeated phantom sequence of previously sent results, so remove them
      .do((right) => this.log('Right:', right));
    return (
      this.operator === '||' ?
      left.distinctUntilChanged((v) => v || false) // normalize all falsy value changes in left node to "false", remove unnecessary emission
        .flatMapLatest((left) => {
          return left ? Rx.Observable.return(left) : right;
        }) :
      left.distinctUntilChanged((v) => v && true) // normalize all truthy value changes in left node to "true", remove unnecessary emission
        .flatMapLatest((left) => {
          return !left ? Rx.Observable.return(left) : right;
        })
    )
    .do((v) => this.log('Result:', v));
  }

}
