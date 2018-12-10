import _ from 'lodash';

import { Rule, RuleDefinition } from '../Rule';
import { LeafNode } from './Leaf';

/**
 * An abstract node class that is extended by the different types of nodes.
 */
export abstract class Node {
  protected readonly condition: Rule;

  /**
   * `parent` is `false` when the node being considered is the root node.
   */
  constructor({ condition }: CommonNodeDefinition, protected readonly parent: Node | false) {
    this.condition = new Rule(condition);
  }

  abstract evaluate(data: any): any;

  abstract toJSON();

  public getParent() {
    return this.parent;
  }

  public isLeafNode(): this is LeafNode {
    return _.has(this, 'value');
  }
}

/**
 * All nodes have a `condition` to be evaluated.
 */
export interface CommonNodeDefinition {
  condition: RuleDefinition;
}
