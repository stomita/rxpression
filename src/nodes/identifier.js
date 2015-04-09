'use strict';

import RxNode from './rxnode';

/**
 *
 */
export default class Identifier {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config) {
    this.name = config.name;
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  evaluate(context) {
    return RxNode.toObservable(context).filter( (obj) => {
      return obj;
    }).flatMap( (obj) => {
      var value = obj[this.name];
      return RxNode.toObservable(value);
    });
  }

}
