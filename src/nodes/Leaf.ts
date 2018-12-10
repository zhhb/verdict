import _ from 'lodash';

import { CommonNodeDefinition, Node } from './Abstract';
import { NodeDefinition } from './Branch';

export class LeafNode extends Node {
  private readonly value: any;

  constructor(definition: LeafNodeDefinition, parent: Node) {
    super(definition, parent);
    this.value = definition.value;
  }

  public get isLeaf() {
    return true;
  }

  public evaluate(data: any) {
    if (this.condition.evaluate(data)) return this.value;
  }

  public toJSON(): LeafNodeDefinition {
    return { condition: this.condition.toJSON(), value: this.value };
  }
}

/**
 * Leaf nodes have a `value` but no `children`.
 */
export interface LeafNodeDefinition extends CommonNodeDefinition {
  value: any;
}

export function isLeafNodeDefinition(definition: NodeDefinition): definition is LeafNodeDefinition {
  return _.has(definition, 'value');
}
