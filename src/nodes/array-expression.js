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
  _evaluate(context, cache) {
    var elems = this.elements.map((elem) => elem.evaluate(context, cache));
    return Rx.Observable.combineLatest(...elems, (...elems) => elems);
  }

}
