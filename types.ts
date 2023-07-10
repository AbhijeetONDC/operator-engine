import { GenerateTmpstmpOperation, GenerateUuidOperation, ReadOperation } from './index';

export enum OPERATIONS {
  READ = 'READ',
  GENERATE_UUID = 'GENERATE_UUID',
  GENERATE_TIMESTAMP = 'GENERATE_TIMESTAMP',
  EQUAL = 'EQUAL',
  NOT_EQUAL = 'NOT_EQUAL',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  IF_THEN = 'IF_THEN',
  CHECK_IF_KEY_EXISTS = 'CHECK_IF_KEY_EXISTS',
}

export interface GenericObject {
  [key: string]: any;
}

export type MixedOperation = (string | Operation)[];

export interface ConditionValue {
  if?: IOperationInputValues;
  then?: IOperationInputValues;
}

export type IOperationInputValues = string[] | Operation[] | MixedOperation | ConditionValue;

export interface IOperationInput {
  if?: IOperationInputValues;
  then?: IOperationInputValues;
  value?: string | Operation;
  values?: IOperationInputValues;
  // operation?: Operation;
}

export interface Operation {
  type: OPERATIONS;
  input: IOperationInput;
}

export interface InstructionSet {
  operation: Operation;
}

export type AllExecutableOperations = GenerateUuidOperation | ReadOperation | GenerateTmpstmpOperation;
