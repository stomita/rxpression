'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

/**
 *
 */
export default class ArrayExpression {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config) {
    this.elements = config.elements.map((elem) => RxNode.build(elem));
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  evaluate(context) {
    var elems = this.elements.map((elem) => elem.evaluate(context));
    return Rx.Observable.combineLatest(...elems, (...elems) => elems)
  }

}
