import _ from 'lodash';

import { LeafNode } from './nodes';
import { BranchNode, BranchNodeDefinition } from './nodes/Branch';

export class DecisionTree extends BranchNode {
  private readonly fallbackValue?: any;

  constructor(definition: DecisionTreeDefinition) {
    // Pass `false` for the second parameter (`parent`) since this is the root node.
    super(definition, false);
    this.fallbackValue = definition.fallbackValue;
  }

  public toJSON() {
    return { ...super.toJSON(), fallbackValue: this.fallbackValue };
  }

  public evaluate(data: any) {
    // Get the raw value obtained from calling `evaluate` on our superclass.
    const returnedVal = super.evaluate(data);

    if (!returnedVal && this.fallbackValue) {
      // If we have a `fallbackValue` and our initial condition is met, return
      // the `fallbackValue`.
      if (this.condition.evaluate(data)) return this.fallbackValue;
    }

    return returnedVal;
  }

  public getLeaves() {
    const leaves = [];

    const recurse = (node: BranchNode | LeafNode) => {
      if (node.isLeafNode()) {
        leaves.push(node);
      } else {
        _.forEach(node.getChildren(), recurse);
      }
    };

    _.forEach(this.children, recurse);

    return leaves;
  }
}

export interface DecisionTreeDefinition extends BranchNodeDefinition {
  /**
   * This option makes it so that the tree is initialized with a "fallback"
   * child. The motivation behind this is to ensure that, once the tree's
   * initial condition is met, we'll _always_ return a value. This is helpful
   * for use-cases where you want to make sure that things don't fall through
   * the cracks.
   */
  fallbackValue?: any;
}
