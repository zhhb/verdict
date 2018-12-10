import _ from 'lodash';

import { DecisionTree } from '../src';
import { Operator } from '../src/Operator';

describe(`Tree`, () => {
  let tree: DecisionTree;

  beforeEach(() => {
    tree = new DecisionTree({
      condition: {
        path: 'foo',
        operator: Operator.Equals,
        value: 'bar',
      },
    });
  });

  describe(`getLeaves`, () => {
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

    it(`returns only the leaves`, () => {
      const leaves = tree.getLeaves();
      expect(_.size(leaves)).toBe(1);
      expect(leaves[0].value).toBe(leafNodeValue);
    });
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

  describe(`with a fallback value`, () => {
    let data: any;
    const fallbackValue = 'BAZ!';

    beforeEach(() => {
      tree = new DecisionTree({
        condition: { path: 'foo', operator: Operator.Equals, value: 'bar' },
        fallbackValue,
      });
    });

    describe(`and the initial condition is met`, () => {
      beforeEach(() => {
        data = { foo: 'bar' };
      });

      describe(`but none of the children's conditions are met`, () => {
        beforeEach(() => {
          tree.addChild({
            condition: { path: 'baz', operator: Operator.Equals, value: 'bar' },
            value: 'quux!',
          });
        });

        it(`returns the fallback value`, () => {
          expect(tree.evaluate(data)).toBe(fallbackValue);
        });
      });

      describe(`and one of the children's conditions are met`, () => {
        const childValue = 'quux!';

        beforeEach(() => {
          tree.addChild({
            condition: { path: 'foo', operator: Operator.Equals, value: 'bar' },
            value: childValue,
          });
        });

        it(`returns the child's value`, () => {
          expect(tree.evaluate(data)).toBe(childValue);
        });
      });
    });

    describe(`and the initial condition isn't met`, () => {
      beforeEach(() => {
        data = {};
      });

      it(`doesn't return anything`, () => {
        expect(tree.evaluate(data)).toBeFalsy();
      });
    });
  });
});
