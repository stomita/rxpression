'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

var orOp = (a, b) => a || b;
var andOp = (a, b) => a && b;

var id = 1;

/**
 *
 */
export default class LogicalExpression extends RxNode {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config, options) {
    super(options);
    this.id = id++;
    this.operator = config.operator;
    this.left = RxNode.build(config.left, options);
    this.right = RxNode.build(config.right, options);
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  _evaluate(context) {
    let left = this.left.evaluate(context); //.do((left) => console.log(this.id+':Left:', left));
    let right = this.right.evaluate(context); //.do((right) => console.log(this.id+':Right:', right));
    return (
      this.operator === '||' ?
      left.distinctUntilChanged((v) => v || false)
        .flatMapLatest((left) => {
          return left ? Rx.Observable.return(left) : right;
        }) :
      left.distinctUntilChanged((v) => v && true)
        .flatMapLatest((left) => {
          return !left ? Rx.Observable.return(left) : right;
        })
    )
    .merge(right.filter(() => false)); // result should depend on right, but not be affected
    // .do((v) => console.log(this.id+':Result:', v));
  }

}
