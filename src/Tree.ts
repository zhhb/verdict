import _ from 'lodash';

import { Rule, RuleDefinition } from './Rule';

export interface DecisionTreeDefinition {
  name: string;
  children?: NodeDefinition[];
}

export class DecisionTree {
  public readonly name: string;
  private readonly children: Node[] = [];

  constructor({ name, children }: DecisionTreeDefinition) {
    this.name = name;
    this.children = _.map(children, child => new Node(child, this));
  }

  public toJSON(): DecisionTreeDefinition {
    const { name, children } = this;
    return { name, children: _.map(children, child => child.toJSON()) };
  }

  public getRoot() {
    return this;
  }

  public getLeaves() {
    const leaves = [];
    const recurse = (node: Node) => {
      if (node.isLeaf) {
        leaves.push(node);
      } else {
        for (const child of node.getChildren()) {
          recurse(child);
        }
      }
    };

    _.forEach(this.children, recurse);

    return leaves;
  }

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
  private readonly root: DecisionTree;
  private value?: any;

  constructor(
    { condition, value, children }: NodeDefinition,
    private readonly parent: Node | DecisionTree,
  ) {
    this.condition = new Rule(condition);
    this.root = parent.getRoot();
    // If a value is provided, then this is a leaf node, otherwise it's a branch.
    if (value) {
      this.value = value;
    } else {
      this.children = _.map(children, child => new Node(child, this));
    }
  }

  public toJSON(): NodeDefinition {
    const { children, condition, value } = this;
    return {
      condition: condition.toJSON(),
      value,
      children: _.map(children, child => child.toJSON()),
    };
  }

  public getRoot() {
    return this.root;
  }

  public get isLeaf() {
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
