import { evaluateOperation } from './util';
import { GenericObject, Operation, IOperationInput } from './types';

abstract class IOElement {
  context: GenericObject = {};
  operation?: Operation;
  value: any;
  __process() {
    if (this.operation) {
      this.value = evaluateOperation(this.context, this.operation);
    }
    return this;
  }
  getValue() {
    return this.value;
  }
}

class Input extends IOElement {
  constructor(context: GenericObject = {}, input: IOperationInput) {
    super();
    this.context = context;
    if (!input.value && !input.values) throw new Error('No values found');
    this.value = input.value || input.values;
    this.__process();
  }
}

class Output extends IOElement {
  constructor(value: string | boolean) {
    super();
    this.value = value;
  }
  getValue() {
    this.__process;
    return this.value;
  }
}

export { Input, Output };
