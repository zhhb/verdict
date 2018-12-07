export enum Operator {
  // Note: Both `IsNull` and `IsNotNull` actually check if the value is "nil"
  // (`null` or `undefined`). You may be asking yourself, "Why not name it
  // `IsNil`, then?" and yeah, well, that's a really great question.
  IsNull = 'IsNull',
  IsNotNull = 'IsNotNull',
  IsTrue = 'IsTrue',
  IsFalse = 'IsFalse',
  Equals = 'Equals',
  NotEquals = 'NotEquals',
  Contains = 'Contains',
  NotContains = 'NotContains',
  In = 'In',
  NotIn = 'NotIn',
  GreaterThan = 'GreaterThan',
  GreaterThanOrEqualTo = 'GreaterThanOrEqualTo',
  LessThan = 'LessThan',
  LessThanOrEqualTo = 'LessThanOrEqualTo',
  ContainsSubstring = 'ContainsSubstring',
  NotContainsSubstring = 'NotContainsSubstring',
}
