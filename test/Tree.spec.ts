import { Operator } from '../src/Operator';
import { DecisionTree } from '../src/Tree';

describe(`Tree`, () => {
  let tree: DecisionTree;

  beforeEach(() => {
    tree = new DecisionTree(`Redwood`);
  });

  describe(`with an immediate LeafNode`, () => {
    let leafNodeValue = 'CoolValue!';

    beforeEach(() => {
      tree.addChild({
        condition: { path: 'foo', operator: Operator.Equals, value: 'bar' },
        value: leafNodeValue,
      });
    });

    describe(`and its conditions are met`, () => {
      let data: any;

      beforeEach(() => {
        data = { foo: 'bar' };
      });

      it(`returns the LeafNode's 'value'`, () => {
        const output = tree.evaluate(data);
        expect(output).toBe(leafNodeValue);
      });
    });

    describe(`and its conditions aren't met`, () => {
      let data: any;

      beforeEach(() => {
        data = { foo: 'baz' };
      });

      it(`returns undefined`, () => {
        const output = tree.evaluate(data);
        expect(output).toBeUndefined();
      });
    });
  });

  describe(`with an immediate BranchNode`, () => {
    let leafNodeValue = 'CoolValue!';

    beforeEach(() => {
      tree.addChild({
        condition: { path: 'foo', operator: Operator.Equals, value: 'bar' },
        children: [
          {
            condition: {
              path: 'bar.baz',
              operator: Operator.ContainsSubstring,
              value: 'foo',
            },
            value: leafNodeValue,
          },
        ],
      });
    });

    describe(`and its conditions are met`, () => {
      let data: any;

      beforeEach(() => {
        data = { foo: 'bar', bar: { baz: 'oOoFoOo' } };
      });

      it(`returns the LeafNode's 'value'`, () => {
        const output = tree.evaluate(data);
        expect(output).toBe(leafNodeValue);
      });
    });

    describe(`and its conditions aren't met`, () => {
      let data: any;

      beforeEach(() => {
        data = { foo: 'bar' };
      });

      it(`returns undefined`, () => {
        const output = tree.evaluate(data);
        expect(output).toBeUndefined();
      });
    });
  });
});
