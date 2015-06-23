'use strict';

import Rx from 'rx';

import nodes from './';


//
var isArray = Array.isArray || ((obj) => Object.prototype.toString.call(obj) === '[object Array]');
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

  evaluate(...args) {
    return this._evaluate(...args).shareReplay(1);
  }

  _evaluate(context) {
    throw new Error('evaluate() should be implemented in subclass.');
  }

  log(...msg) {
    if (this._debug) { console.log(...msg); }
  }

  /**
   *
   */
  static build(config, options) {
    var Node = nodes[config.type];
    if (!Node) {
      var error = new Error('No node type registered: ' + config.type);
      error.lineNumber = config.loc.start.line;
      error.column = config.loc.start.column;
      throw error;
    }
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

  /**
   *
   */
  static combineLatestRecursive(value) {
    if (isArray(value)) {
      var elements = value.map(elem => RxNode.combineLatestRecursive(elem));
      return Rx.Observable.combineLatest(...elements, (...elements) => {
        return elements;
      });
    } else if (isObject(value) && !RxNode.isObservable(value) && !RxNode.isPromiseLike(value)) {
      var members = Object.keys(value).map((key) => {
        return RxNode.combineLatestRecursive(value[key]).map((value) => {
          return { key, value };
        });
      });
      var object = {};
      return Rx.Observable.merge(...members).map((member) => {
        object[member.key] = member.value;
        return object;
      });
    } else {
      return RxNode.toObservable(value);
    }
  }

}
