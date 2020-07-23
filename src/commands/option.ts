import {ExecutionError} from '../errors/execution-error';

export type Executor<T> = (it: T) => Promise<T>;

export interface OptionLike<T> {
  label?: string;
  description?: string;
  value: T;
}

export type ExecuteFunc<T> = () => Promise<T>;

export interface Command<T> {
  command: string;
  execute: ExecuteFunc<T>;
  label: string;
  description: string;
}

// TODO: simplify this!
// export interface ConvertFunc<V, T extends OptionLike<V>> {
//   (raw: { [command: string]: T }, factory: (option: T) => ExecuteFunc<V>): { [command: string]: Command<V> }
// }
export const toCommands = <V, O, T extends OptionLike<O>>(raw: { [command: string]: T }, factory: (option: T) => ExecuteFunc<V>) => {
  const result: { [command: string]: Command<V> } = {}
  for (const command of Object.keys(raw)) {
    const value = raw[command];
    result[command] = {
      command,
      execute: factory(value),
      label: value.label || command,
      description: value.description || (value.label || command),
    };
  }
  return Object.freeze(result);
}

type Commands<T> = { [command: string]: Command<T> };

export const run = async <T>(commandsName: string, commands: Commands<T>, command?: keyof Commands<T>): Promise<T> => {
  command = (String(command || ``)).trim();
  const isEmpty = command.length === 0;
  if (isEmpty) {
    throw new ExecutionError(`What should I do with ${commandsName}?`);
  }
  const myCommand = commands[command];
  if (!myCommand) {
    throw new ExecutionError(`Unsupported command: ${command}`);
  }

  return myCommand.execute();
};

