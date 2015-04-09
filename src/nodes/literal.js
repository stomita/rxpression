'use strict';

import Rx from 'rx';

/**
 *
 */
export default class Literal {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config) {
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
