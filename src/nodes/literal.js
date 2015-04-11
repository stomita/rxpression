'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

/**
 *
 */
export default class Literal extends RxNode {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config, options) {
    super(options);
    this.value = config.value;
    this.raw = config.raw;
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  evaluate(observable) {
    return Rx.Observable.just(this.value);
  }

}
