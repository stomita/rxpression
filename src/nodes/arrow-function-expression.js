'use strict';

import Rx from 'rx';
import RxNode from './rxnode';

/**
 *
 */
export default class ArrowFunctionExpression extends RxNode {

  /**
   * @param {Object} config - AST config for the node
   */
  constructor(config, options) {
    super(options);
    this.params = config.params;
    this.defaults = config.defaults.map(value => RxNode.build(value, options));
    this.body = RxNode.build(config.body, options);
  }

  /**
   * @param {Observable} context
   * @param {Object} cache
   * @returns {Observable}
   */
  _evaluate(context, cache) {
    var defaults = this.defaults.map(value => value.evaluate(context, cache));
    return RxNode.toObservable(context).map((context) => {
      return (...params) => {
        var fn = function() {};
        fn.prototype = context;
        var ctx = new fn();
        this.params.forEach((paramDef, i) => {
          var pname = paramDef.name;
          var pvalue = params[i];
          ctx[pname] = typeof pvalue === 'undefined' || pvalue === null ? defaults[i] : pvalue;
        });
        return this.body.evaluate(ctx, Object.assign({}, cache));
      };
    });
  }

}
