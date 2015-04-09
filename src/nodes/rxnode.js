'use strict';

import Rx from 'rx';

import ExpressionStatement from './expression-statement';
import BinaryExpression from './binary-expression';
import MemberExpression from './member-expression';
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
      case 'MemberExpression' :
        return new MemberExpression(config);
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
