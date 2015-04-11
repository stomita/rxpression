'use strict';

import Rx from 'rx';

import nodes from './';


//
var isArray = Array.isArray || (obj) => Object.prototype.toString.call(obj) === '[object Array]';
var isObject = (obj) => {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};


/**
 *
 */
export default class RxNode {

  constructor(options) {
    options = options || {};
    this._debug = options.debug;
  }

  log(...msg) {
    if (this._debug) { console.log(...msg); }
  }

  /**
   *
   */
  static build(config, options) {
    var Node = nodes[config.type];
    if (!Node) { throw new Error('No node type registered: ' + config.type); }
    return new Node(config, options);
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

  /**
   *
   */
  static isObservable(value) {
    return typeof value === 'object' && typeof value.subscribe === 'function';
  }

  /**
   *
   */
  static isPromiseLike(value) {
    return typeof value === 'object' && typeof value.then === 'function';
  }

}
