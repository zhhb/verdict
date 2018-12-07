import _ from 'lodash';

import { Operator } from './Operator';

export type RuleDefinition = CompoundRuleDefinition | SingleRuleDefinition;

export interface CompoundRuleDefinition {
  and?: RuleDefinition[];
  or?: RuleDefinition[];
}

export interface SingleRuleDefinition {
  path: string;
  operator: Operator;
  value?: any;
}

export class Rule {
  private readonly and?: Rule[];
  private readonly or?: Rule[];
  private readonly path?: string;
  private readonly operator?: Operator;
  private readonly value?: any;

  constructor(definition: RuleDefinition) {
    if (isCompoundRule(definition)) {
      this.and = _.map(definition.and, rule => new Rule(rule));
      this.or = _.map(definition.or, rule => new Rule(rule));
    } else {
      Object.assign(this, definition);
    }
  }

  public get isCompoundRule() {
    return _.has(this, 'and') || _.has(this, 'or');
  }

  public toJSON(): RuleDefinition {
    if (this.isCompoundRule) {
      if (this.and) return { and: _.map(this.and, rule => rule.toJSON()) };
      if (this.or) return { or: _.map(this.or, rule => rule.toJSON()) };
    } else {
      const { path, operator, value } = this;
      return { path, operator, value };
    }
  }

  /**
   * Evaluates a data object using its configured `path`, `operator`, and
   * `value` properties. Returns a boolean.
   */
  public evaluate(data: any): boolean {
    const leftOperand = _.get(data, this.path);

    if (this.and) {
      return _.every(this.and, rule => rule.evaluate(data));
    }

    if (this.or) {
      return _.every(this.or, rule => rule.evaluate(data));
    }

    switch (this.operator) {
      case Operator.IsNull:
        return this.isNil(leftOperand);
      case Operator.IsNotNull:
        return !this.isNil(leftOperand);
      case Operator.IsTrue:
        return leftOperand === true;
      case Operator.IsFalse:
        return leftOperand === false;
      case Operator.Equals:
        return this.equals(leftOperand, this.value);
      case Operator.NotEquals:
        return !this.equals(leftOperand, this.value);
      case Operator.Contains:
        return this.contains(leftOperand, this.value);
      case Operator.NotContains:
        return !this.contains(leftOperand, this.value);
      case Operator.In:
        return this.in(leftOperand, this.value);
      case Operator.NotIn:
        return !this.in(leftOperand, this.value);
      case Operator.GreaterThan:
        return this.greaterThan(leftOperand, this.value);
      case Operator.GreaterThanOrEqualTo:
        return this.greaterThanOrEqualTo(leftOperand, this.value);
      case Operator.LessThan:
        return this.lessThan(leftOperand, this.value);
      case Operator.LessThanOrEqualTo:
        return this.lessThanOrEqualTo(leftOperand, this.value);
      case Operator.ContainsSubstring:
        return this.containsSubstring(leftOperand, this.value);
      case Operator.NotContainsSubstring:
        return !this.containsSubstring(leftOperand, this.value);
    }
  }

  private isNil(value) {
    return _.isNil(value);
  }

  private equals(leftOperand, rightOperand) {
    return _.isEqual(leftOperand, rightOperand);
  }

  private contains(leftOperand, rightOperand) {
    // Support passing in either a single value or an array of values to check.
    rightOperand = _.castArray(rightOperand);
    // `_.intersection` returns the unique values that are included in all given
    // arrays. By checking the size of the resulting array, we can see if any of
    // the values from `rightOperand` are contained within `leftOperand`.
    return !!_.size(_.intersection(leftOperand, rightOperand));
  }

  private in(leftOperand, rightOperand) {
    return _.includes(rightOperand, leftOperand);
  }

  private greaterThan(leftOperand, rightOperand) {
    return _.gt(leftOperand, rightOperand);
  }

  private greaterThanOrEqualTo(leftOperand, rightOperand) {
    return _.gte(leftOperand, rightOperand);
  }

  private lessThan(leftOperand, rightOperand) {
    return _.lt(leftOperand, rightOperand);
  }

  private lessThanOrEqualTo(leftOperand, rightOperand) {
    return _.lte(leftOperand, rightOperand);
  }

  private containsSubstring(leftOperand: string, rightOperand: string) {
    if (!leftOperand) return false;
    return leftOperand.toLowerCase().includes(rightOperand.toLowerCase());
  }
}

function isCompoundRule(rule: RuleDefinition): rule is CompoundRuleDefinition {
  return _.has(rule, 'and') || _.has(rule, 'or');
}
