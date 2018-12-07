import { Operator } from '../src/Operator';
import { Rule, RuleDefinition } from '../src/Rule';

describe(`Rule`, () => {
  let ruleDefinition: RuleDefinition;

  beforeEach(() => {
    ruleDefinition = {
      and: [
        {
          path: 'foo.bar',
          operator: Operator.Equals,
          value: 'baz',
        },
        {
          path: 'foo.baz.quux',
          operator: Operator.IsNull,
        },
      ],
    };
  });

  describe(`evaluate`, () => {
    it(`returns 'true' appropriately`, () => {
      const data = { foo: { bar: 'baz', baz: { quux: undefined } } };
      const rule = new Rule(ruleDefinition);
      expect(rule.evaluate(data)).toBeTruthy();
    });

    it(`returns 'false' appropriately`, () => {
      const data = { foo: { bar: 'baz', baz: { quux: `I'M NOT NULL` } } };
      const rule = new Rule(ruleDefinition);
      expect(rule.evaluate(data)).toBeFalsy();
    });
  });
});
