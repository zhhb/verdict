import _ from 'lodash';

import { Rule, RuleDefinition } from './Rule';

export class DecisionTree {
  private readonly children: Node[] = [];

  constructor(public readonly name: string) {}

  public addChild(child: NodeDefinition) {
    this.children.push(new Node(child, this));
  }

  public getChildren() {
    return this.children;
  }

  public evaluate(data: any) {
    for (const child of this.children) {
      const val = child.evaluate(data);
      if (val) return val;
    }
  }
}

export interface NodeDefinition {
  children?: NodeDefinition[];
  condition: RuleDefinition;
  value?: any;
}

export class Node {
  private readonly children?: Node[];
  private readonly condition: Rule;
  private value?: any;

  constructor(
    { condition, value, children }: NodeDefinition,
    private readonly parent: Node | DecisionTree,
  ) {
    this.condition = new Rule(condition);
    // If a value is provided, then this is a leaf node, otherwise it's a branch.
    if (value) {
      this.value = value;
    } else {
      this.children = _.map(children, child => new Node(child, this));
    }
  }

  private get isLeaf() {
    return !!this.value;
  }

  public addChild(child: NodeDefinition) {
    if (this.isLeaf) {
      throw new Error(
        `You can't add children to a leaf node. ` +
          `You must first convert the node into a branch.`,
      );
    }
    this.children.push(new Node(child, this));
  }

  public getChildren() {
    return this.children;
  }

  public evaluate(data: any) {
    if (this.condition.evaluate(data)) {
      if (this.isLeaf) return this.value;
      for (const child of this.children) {
        const val = child.evaluate(data);
        if (val) return val;
      }
    }
  }
}
