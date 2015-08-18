'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

/**
 *
 */
export default class Property extends RxNode {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config, options) {
    super(options);
    if (config.kind !== "init") {
      throw new Error("Property kind " + config.kind + " is not supported");
    }
    this.key = config.key.type === 'Literal' ? config.key.value : config.key.name;
    this.value = RxNode.build(config.value, options);
  }

  /**
   * @param {Observable} context
   * @param {Object} cache
   * @returns {Observable}
   */
  _evaluate(context, cache) {
    return this.value.evaluate(context, cache).map( (value) => {
      return { key: this.key, value: value };
    });
  }

}
