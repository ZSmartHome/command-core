import {ExecutionError} from '..';
import {asCommand, Command} from './command';
import {Option} from './option';
import {each} from '../util';

export default abstract class Executor<T extends Option, V> {
  get name(): string {
    return this._name;
  }

  get commands(): Command[] {
    return this._commands;
  }
  private _commands: Command[] = [];

  protected constructor(
    private _name: string,
    private optionsMap: {[key: string]: T}
    ) {
    for (const [key, option] of each(optionsMap)) {
      this._commands.push(asCommand(key as string, option.label, option.description));
    }
  }

  public async run(command?: string): Promise<V> {
    command = (String(command || ``)).trim();
    const isEmpty = command.length === 0;

    if (isEmpty) {
      throw new ExecutionError(`What should I do with ${this._name}?`);
    }

    const myCommand = this.optionsMap[command];
    if (!myCommand) {
      throw new ExecutionError(`Unsupported command: ${command}`);
    }

    return this.execute(myCommand);
  }

  protected abstract async execute(option: T): Promise<V>;
}