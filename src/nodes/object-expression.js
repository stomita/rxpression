'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

/**
 *
 */
export default class ObjectExpression {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config) {
    this.properties = config.properties.map( (prop) => RxNode.build(prop) );
  }

  /**
   * @param {Observable} context
   * @returns {Observable}
   */
  evaluate(context) {
    var props = this.properties.map( (prop) => prop.evaluate(context) );
    return Rx.Observable.combineLatest(...props, (...props) => {
      var obj = {};
      props.forEach( (prop) => obj[prop.key] = prop.value );
      return obj;
    });
  }

}
