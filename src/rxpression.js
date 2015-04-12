'use strict';

import esprima from 'esprima';
import Rx from 'rx';

import { RxNode } from './nodes';

/**
 *
 */
export default class Rxpression {

  /**
   * @param {String} expr - Expression string to be parsed and evaluated in Rx way
   */
  constructor(expr, options={}) {
    try {
      var tree = esprima.parse(expr, { loc: true });
      if (tree.body.length !== 1) {
        throw new Error('Only one expression statement is allowed in body');
      }
      this._node = RxNode.build(tree.body[0]);
    } catch(e) {
      if (options.debug) {
        console.error(e.stack);
      }
      throw createExpressionSyntaxError(expr, e);
    }
    return this;
  }

  /**
   * @param {Observable|Object>} context - An observable object which provides evaluation context
   * @returns {Observable}
   */
  evaluate(context) {
    context = RxNode.toObservable(context);
    return this._node.evaluate(context).map(ret => {
      return RxNode.combineLatestRecursive(ret);
    }).flatMap(ret => ret) ;
  }

};

function createExpressionSyntaxError(expr, error) {
  var message;
  if (error.lineNumber > 0 && error.column >= 0) {
    var caret = '';
    for (var i=0; i < error.column; i++) { caret += ' '; }
    caret += '^';
    var line = expr.split('\n')[error.lineNumber - 1];
    message = [
      `at line:${error.lineNumber}, column:${error.column}`,
      line,
      caret
    ].join('\n');
  } else {
    message = error.message;
  }
  var err = new Error(message);
  err.name = 'Expression Syntax Error';
  return err;
}
