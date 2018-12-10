import _ from 'lodash';

import { CommonNodeDefinition, Node } from './Abstract';
import { LeafNode, LeafNodeDefinition, isLeafNodeDefinition } from './Leaf';

export class BranchNode extends Node {
  protected readonly children: (LeafNode | BranchNode)[] = [];

  constructor({ condition, children }: BranchNodeDefinition, parent: Node | false) {
    super({ condition }, parent);
    this.children = _.map(children, child => this.createChild(child));
  }

  public addChild(definition: LeafNodeDefinition | BranchNodeDefinition) {
    const child = this.createChild(definition);
    this.children.push(child);
    return child;
  }

  public evaluate(data: any) {
    if (this.condition.evaluate(data)) {
      for (const child of this.children) {
        const val = child.evaluate(data);
        if (val) return val;
      }
    }
  }

  public getChildren() {
    return this.children;
  }

  public toJSON(): BranchNodeDefinition {
    return {
      condition: this.condition.toJSON(),
      children: _.invokeMap(this.children, 'toJSON'),
    };
  }

  private createChild(definition: LeafNodeDefinition | BranchNodeDefinition) {
    return isLeafNodeDefinition(definition)
      ? new LeafNode(definition, this)
      : new BranchNode(definition, this);
  }
}

/**
 * Branch nodes have `children` but no `value`.
 */
export interface BranchNodeDefinition extends CommonNodeDefinition {
  children?: NodeDefinition[];
}

export type NodeDefinition = BranchNodeDefinition | LeafNodeDefinition;
