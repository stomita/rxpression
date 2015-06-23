'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

/**
 *
 */
export default class ArrayExpression extends RxNode {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config, options) {
    super(options);
    this.elements = config.elements.map((elem) => RxNode.build(elem, options));
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  _evaluate(context, debug) {
    var elems = this.elements.map((elem) => elem.evaluate(context, debug));
    return Rx.Observable.combineLatest(...elems, (...elems) => elems);
  }

}
