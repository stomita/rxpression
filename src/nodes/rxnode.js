'use strict';

import Rx from 'rx';

import ExpressionStatement from './expression-statement';
import BinaryExpression from './binary-expression';
import LogicalExpression from './logical-expression';
import MemberExpression from './member-expression';
import ArrayExpression from './array-expression';
import ObjectExpression from './object-expression';
import ConditionalExpression from './conditional-expression';
import CallExpression from './call-expression';
import Property from './property';
import Identifier from './identifier';
import Literal from './literal';

/**
 *
 */
export default class RxNode {
  /**
   *
   */
  static build(config) {
    switch (config.type) {
      case 'ExpressionStatement' :
        return new ExpressionStatement(config);
      case 'BinaryExpression' :
        return new BinaryExpression(config);
      case 'LogicalExpression' :
        return new LogicalExpression(config);
      case 'MemberExpression' :
        return new MemberExpression(config);
      case 'ArrayExpression' :
        return new ArrayExpression(config);
      case 'ObjectExpression' :
        return new ObjectExpression(config);
      case 'ConditionalExpression' :
        return new ConditionalExpression(config);
      case 'CallExpression' :
        return new CallExpression(config);
      case 'Property' :
        return new Property(config);
      case 'Identifier' :
        return new Identifier(config);
      case 'Literal' :
        return new Literal(config);
      default:
        throw new Error('No node type registered: ' + config.type)
    }
  }

  /**
   *
   */
  static toObservable(value) {
    if (RxNode.isObservable(value)) {
      return value;
    } else if (RxNode.isPromiseLike(value)) {
      return Rx.Observable.fromPromise(value);
    } else {
      return Rx.Observable.just(value);
    }
  }

  static isObservable(value) {
    return typeof value === 'object' && typeof value.subscribe === 'function';
  }

  static isPromiseLike(value) {
    return typeof value === 'object' && typeof value.then === 'function';
  }

}
