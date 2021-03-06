let nodes = {};
export default nodes;

import RxNode from './rxnode';
import ExpressionStatement from './expression-statement';
import BinaryExpression from './binary-expression';
import UnaryExpression from './unary-expression';
import LogicalExpression from './logical-expression';
import MemberExpression from './member-expression';
import ConditionalExpression from './conditional-expression';
import CallExpression from './call-expression';
import ArrowFunctionExpression from './arrow-function-expression';
import ArrayExpression from './array-expression';
import ObjectExpression from './object-expression';
import Property from './property';
import Identifier from './identifier';
import Literal from './literal';

Object.assign(nodes,
  { RxNode, ExpressionStatement, BinaryExpression, UnaryExpression, LogicalExpression,
    MemberExpression, ConditionalExpression, CallExpression,
    ArrowFunctionExpression, ArrayExpression, ObjectExpression,
    Property, Identifier, Literal }
);
