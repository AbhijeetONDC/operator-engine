import * as _ from 'lodash';
import { Output, Input } from './schema';
import { GenericObject } from './types';
import { evaluateOperation } from './util';

class Operator {
  constructor(context: GenericObject) {
    this.context = context;
  }
  context;
  input?: Input;
  output?: Output;
  setInput(input: Input) {
    this.input = input.__process();
    return this;
  }
  __process(): this {
    return this;
  }
  getOutput() {
    if (!this.__process) throw new Error('No output set');
    return this.__process()?.output?.__process();
  }
}

class GenerateUuidOperation extends Operator {
  __process(): this {
    this.output = new Output(crypto.randomUUID());
    return this;
  }
}

class GenerateTmpstmpOperation extends Operator {
  __process(): this {
    this.output = new Output(new Date().toISOString());
    return this;
  }
}

class ReadOperation extends Operator {
  __process(): this {
    const value = this.getAttribute(this.context, this.input?.getValue());

    if (!value) throw new Error(`No value found at the specified path: ${this.input?.getValue()}`);
    this.output = new Output(value);
    return this;
  }

  getAttribute(data: GenericObject, keys: string): string | undefined {
    return _.get(data, keys, undefined);
  }
}

class EqualOperation extends Operator {
  __process(): this {
    const value = this.input?.getValue();
    let equal = true;

    if (_.isArray(value) && value.length > 1) {
      const resolvedValues: string[] = [];
      value.forEach((eachValue) => {
        let resolvedValue: string = '';

        if (typeof eachValue === 'object') {
          resolvedValue = evaluateOperation(this.context, eachValue);
          resolvedValues.push(resolvedValue);
        } else if (typeof eachValue === 'string') resolvedValue = eachValue;

        if (resolvedValues.length > 0 && !resolvedValues.includes(resolvedValue)) {
          this.output = new Output(false);
          equal = false;
          return this;
        }
      });
      if (equal) this.output = new Output(true);
      else this.output = new Output(false);
      return this;
    } else throw new Error('More than 1 input arrays elements are required');
  }
}

class NotEqualOperation extends Operator {
  __process(): this {
    const value = this.input?.getValue();

    if (_.isArray(value) && value.length > 1) {
      const resolvedValues = new Set();
      value.forEach((eachValue) => {
        let resolvedValue: string = '';

        if (typeof eachValue === 'object') {
          resolvedValue = evaluateOperation(this.context, eachValue);
        } else if (typeof eachValue === 'string') resolvedValue = eachValue;

        resolvedValues.add(resolvedValue);
      });

      if (resolvedValues.size > 1) this.output = new Output(true);
      else this.output = new Output(false);

      return this;
    } else throw new Error('More than 1 input arrays elements are required');
  }
}

class GreaterThanOperation extends Operator {
  __process(): this {
    const value = this.input?.getValue();

    if (_.isArray(value) && value.length === 2) {
      const resolvedValues: number[] = [];
      value.forEach((eachValue) => {
        let resolvedValue;

        if (typeof eachValue === 'object') {
          resolvedValue = evaluateOperation(this.context, eachValue);
        } else if (typeof eachValue === 'string') resolvedValue = eachValue;
        resolvedValue = parseInt(resolvedValue || '', 10);
        if (!_.isFinite(resolvedValue)) throw new Error('Only valid number comparisons are allowed');
        resolvedValues.push(resolvedValue);
      });

      this.output = new Output(resolvedValues[0] > resolvedValues[1]);

      return this;
    } else throw new Error('Array should have two elements for comparison');
  }
}

class LessThanOperation extends Operator {
  __process(): this {
    const value = this.input?.getValue();

    if (_.isArray(value) && value.length === 2) {
      const resolvedValues: number[] = [];
      value.forEach((eachValue) => {
        let resolvedValue;

        if (typeof eachValue === 'object') {
          resolvedValue = evaluateOperation(this.context, eachValue);
        } else if (typeof eachValue === 'string') resolvedValue = eachValue;
        resolvedValue = parseInt(resolvedValue || '', 10);
        if (!_.isFinite(resolvedValue)) throw new Error('Only valid number comparisons are allowed');
        resolvedValues.push(resolvedValue);
      });

      this.output = new Output(resolvedValues[0] < resolvedValues[1]);

      return this;
    } else throw new Error('Array should have two elements for comparison');
  }
}

class IfThenOperation extends Operator {
  __process(): this {
    const value = this.input?.getValue();

    if (!value?.if || !value?.then) throw new Error('If and then clauses are needed');

    const ifResponse = this.resolveActions(value?.if);
    const thenResponse = this.resolveActions(value?.then);

    if (ifResponse && thenResponse) this.output = new Output(true);
    else this.output = new Output(false);
    return this;
  }

  resolveActions(actions: any[]) {
    let response = true;
    if (_.isArray(actions) && actions.length > 1) {
      actions.forEach((eachValue) => {
        let resolvedValue: string = '';

        if (typeof eachValue === 'object') {
          resolvedValue = evaluateOperation(this.context, eachValue);
        } else if (typeof eachValue === 'string') resolvedValue = eachValue;

        if (!resolvedValue) response = false;
      });

      return response;
    } else throw new Error('More than 1 input arrays elements are required');
  }
}

class KeyExistsOperation extends Operator {
  __process(): this {
    if (!this.input?.getValue()) throw new Error('A valid key value is needed');
    const value = this.getAttribute(this.context, this.input?.getValue());

    this.output = new Output(value);
    return this;
  }

  getAttribute(data: GenericObject, keys: string): boolean {
    return _.has(data, keys);
  }
}

export {
  GenerateUuidOperation,
  EqualOperation,
  LessThanOperation,
  IfThenOperation,
  GreaterThanOperation,
  KeyExistsOperation,
  NotEqualOperation,
  GenerateTmpstmpOperation,
  ReadOperation,
};
