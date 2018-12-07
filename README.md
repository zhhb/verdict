# verdict

A lightweight decision tree/rules engine.

## Features

* Support for complex branching logic
* Support for `and`/`or` boolean logic
* Wide range of operators supported

## Installation

Install with `yarn`:

```bash
yarn add verdict
```

## Usage

```ts
import { DecisionTree, Operator } from 'verdict';

// Create a new DecisionTree
const tree = new DecisionTree({ name: 'Redwood' });

// Start by adding a child to the tree. Because the child doesn't specify a
// `value`, it's assumed to be a "branch" node which means that it's expected to
// have one or more children (at some point).
tree.addChild({
  condition: {
    path: 'foo.bar',
    operator: Operator.Equals,
    value: 'baz',
  },
});

// Obtain a reference to the child node that we just made.
const [child] = tree.getChildren();

// Follow the same process for adding another descendent (grandchild in this
// case). Note that it's not necessary to have this as a separate step. We
// easily could have included a `children` property within our first payload
// that we passed to `addChild` and included the grandchild there.
child.addChild({
  condition: {
    path: 'foo.baz',
    operator: Operator.ContainsSubstring,
    value: 'quux',
  },
  // Because the child has a `value` field, it's considered a leaf node.
  value: `Yay! I'm a leaf node!`,
});

const data = {
  foo: {
    bar: 'baz',
    baz: 'oOoQuuXoOo',
  },
}

console.log(tree.evaluate(data)); // Yay! I'm a leaf node!
```

If you're not interested in creating a decision tree, you can import **`Rule`** from
the package and use it on its own.

### Inspiration

This library was inspired by [verdict.js](https://www.npmjs.com/package/verdict.js).
