'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

/**
 *
 */
export default class Property {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config) {
    if (config.kind !== "init") {
      throw new Error("Property kind " + config.kind + " is not supported");
    }
    this.key = config.key.type === 'Literal' ? config.key.value : config.key.name;
    this.value = RxNode.build(config.value);
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  evaluate(context) {
    return this.value.evaluate(context).map( (value) => {
      return { key: this.key, value: value };
    });
  }

}
