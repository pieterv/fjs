/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 */

'use strict';

import Printers from '../Printers';
import Tokens from '../Tokens';

import assert from 'assert';
import {map, printList, printJoin} from '../utils';

export default {
  AnyTypeAnnotation: () => Tokens.string('any'),

  BooleanTypeAnnotation: () => Tokens.string('boolean'),

  BooleanLiteralTypeAnnotation: ({node}) => node.value
    ? Tokens.string('true')
    : Tokens.string('false'),

  ExistentialTypeParam: () => [
    Tokens.string('*'),
  ],

  FunctionTypeAnnotation: ({node, print, path}) => [
    print(node.typeParameters),
    Tokens.string('('),
    (node.params.length || node.rest) && [
      Tokens.scopeOpen('object'),
      Tokens.scopeEmptyOrBreak(),
      map(node.params, (param, i, arr) => [
        i > 0 && Tokens.scopeSpaceOrBreak(),
        print(param),
        arr.length - 1 !== i && !node.rest
          ? Tokens.comma()
          : Tokens.scopeEmptyOrComma(),
      ]),
      node.rest && [
        node.params.length && [
          Tokens.comma(),
          Tokens.scopeSpaceOrBreak(),
        ],
        Tokens.string('...'),
        print(node.rest),
        Tokens.scopeEmptyOrComma(),
      ],
      Tokens.scopeEmptyOrBreak(),
      Tokens.scopeClose(),
    ],
    Tokens.string(')'),
    (
      path[path.length - 2].type === 'ObjectTypeProperty' ||
      path[path.length - 2].type === 'ObjectTypeCallProperty' ||
      path[path.length - 2].type === 'DeclareFunction'
    )
      ? Tokens.colon()
      : [
        Tokens.space(),
        Tokens.string('=>'),
      ],
    Tokens.space(),
    print(node.returnType),
  ],

  FunctionTypeParam: ({node, print}) => [
    print(node.name),
    node.optional && Tokens.questionMark(),
    Tokens.colon(),
    Tokens.space(),
    print(node.typeAnnotation),
  ],

  GenericTypeAnnotation: ({node, print}) => [
    print(node.id),
    print(node.typeParameters),
  ],

  IntersectionTypeAnnotation: ({node, print}) => [
    printJoin(node.types, print, Tokens.string('&')),
  ],

  MixedTypeAnnotation: () => Tokens.string('mixed'),

  NullableTypeAnnotation: ({node, print}) => [
    Tokens.questionMark(),
    print(node.typeAnnotation),
  ],

  NullLiteralTypeAnnotation: () => Token.string('null'),

  NumberTypeAnnotation: () => Tokens.string('number'),

  NumericLiteralTypeAnnotation: ({node}) => Tokens.string(node.extra.raw),

  ObjectTypeAnnotation: ({node, print}) => Printers.Object({
    properties: node.properties,
    print,
  }),

  ObjectTypeProperty: ({node, print}) => [
    node.static && [
      Tokens.string('static'),
      Tokens.space(),
    ],
    print(node.key),
    node.optional && Tokens.questionMark(),
    node.value.type !== 'FunctionTypeAnnotation' && [
      Tokens.colon(),
      Tokens.space(),
    ],
    print(node.value),
  ],

  StringLiteralTypeAnnotation: ({node}) => Printers.String({
    value: node.value,
    quotes: 'single',
  }),

  StringTypeAnnotation: () => Tokens.string('string'),

  ThisTypeAnnotation: () => Tokens.string('this'),

  TupleTypeAnnotation: ({node, print}) => [
    Tokens.string('['),
    printList(node.types, print),
    Tokens.string(']'),
  ],

  TypeAlias: ({node, print}) => [
    Tokens.string('type'),
    Tokens.space(),
    print(node.id),
    print(node.typeParameters),
    Tokens.space(),
    Tokens.string('='),
    Tokens.space(),
    print(node.right),
    Tokens.semiColon(),
    Tokens.break(),
  ],

  TypeAnnotation: ({node, print}) => [
    Tokens.string(':'),
    Tokens.space(),
    print(node.typeAnnotation),
  ],

  TypeCastExpression: ({node, print}) => [
    Tokens.string('('),
    print(node.expression),
    print(node.typeAnnotation),
    Tokens.string(')'),
  ],

  TypeofTypeAnnotation: ({node, print}) => [
    Tokens.string('typeof'),
    Tokens.space(),
    print(node.argument),
  ],

  TypeParameter: ({node, print}) => [
    node.variance === 'plus' && Tokens.string('+'),
    node.variance === 'minus' && Tokens.string('-'),
    Tokens.string(node.name),
    print(node.bound),
  ],

  TypeParameterDeclaration: ({node, print}) => [
    Tokens.string('<'),
    printList(node.params, print),
    Tokens.string('>'),
  ],

  TypeParameterInstantiation: ({node, print}) => [
    Tokens.string('<'),
    printList(node.params, print),
    Tokens.string('>'),
  ],

  UnionTypeAnnotation: ({node, print}) => [
    printJoin(node.types, print, Tokens.string('|')),
  ],

  VoidTypeAnnotation: () => Tokens.string('void'),
};
