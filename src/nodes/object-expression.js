'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

/**
 *
 */
export default class ObjectExpression extends RxNode {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config, options) {
    super(options);
    this.properties = config.properties.map( (prop) => RxNode.build(prop, options) );
  }

  /**
   * @param {Observable} context
   * @param {Object} cache
   * @returns {Observable}
   */
  _evaluate(context, cache) {
    var props = this.properties.map( (prop) => prop.evaluate(context, cache) );
    return Rx.Observable.combineLatest(...props, (...props) => {
      var obj = {};
      props.forEach( (prop) => obj[prop.key] = prop.value );
      return obj;
    });
  }

}
