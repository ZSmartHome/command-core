import {ExecutionError} from '..';

export interface OptionLike<T> {
  label?: string;
  description?: string;
  executor: Executor<T>
}


export interface Command<T> {
  command: string;
  action: Action<T>;
  label: string;
  description: string;
}

export type Executor<T> = (it: T) => Promise<T>;

export abstract class Action<T> {
  protected constructor(protected executor: Executor<T>) {
  }

  public abstract async execute(): Promise<T>
}

type Commands<T> = { [command: string]: Command<T> };

export const execute = async <T>(commandsName: string, commands: Commands<T>, command?: keyof Commands<T>): Promise<T> => {
  command = (String(command || ``)).trim();
  const isEmpty = command.length === 0;
  if (isEmpty) {
    throw new ExecutionError(`What should I do with ${commandsName}?`);
  }
  const myCommand = commands[command];
  if (!myCommand) {
    throw new ExecutionError(`Unsupported command: ${command}`);
  }

  return myCommand.action.execute();
};

