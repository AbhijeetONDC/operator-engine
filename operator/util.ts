import {
  GenerateUuidOperation,
  ReadOperation,
  EqualOperation,
  NotEqualOperation,
  GenerateTmpstmpOperation,
  GreaterThanOperation,
  LessThanOperation,
  IfThenOperation,
  KeyExistsOperation,
} from './index';
import { Input } from './schema';
import { AllExecutableOperations, GenericObject, IOperationInput, Operation, OPERATIONS } from './types';

const evaluateOperation = (context: GenericObject, op: Operation): string => {
  const opt = __getOperation(context, op.type);
  if (op.input) {
    opt.input = __evaluateInput(context, op.input);
  }

  const output = opt.getOutput()?.getValue();

  if (output === undefined || output === null) throw new Error('No output value found');

  return output;
};

const __evaluateInput = (context: GenericObject, inputObj: IOperationInput) => {
  const input = new Input(context, inputObj);
  return input;
};

const __getOperation = (context: GenericObject, opType: OPERATIONS): AllExecutableOperations => {
  switch (opType) {
    case 'GENERATE_UUID':
      return new GenerateUuidOperation(context);
    case 'READ':
      return new ReadOperation(context);
    case 'GENERATE_TIMESTAMP':
      return new GenerateTmpstmpOperation(context);
    case 'EQUAL':
      return new EqualOperation(context);
    case 'NOT_EQUAL':
      return new NotEqualOperation(context);
    case 'GREATER_THAN':
      return new GreaterThanOperation(context);
    case 'LESS_THAN':
      return new LessThanOperation(context);
    case 'CHECK_IF_KEY_EXISTS':
      return new KeyExistsOperation(context);
    case 'IF_THEN':
      return new IfThenOperation(context);
    default:
      throw new Error('Operation not found');
  }
};

export { evaluateOperation };
