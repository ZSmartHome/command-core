import Store, {Value} from './store';
import * as path from 'path';
import * as fs from 'fs';
import {promisify} from 'util';
import * as os from 'os';

const write = promisify(fs.writeFile);
const read = promisify(fs.readFile);

const ENCODING = `utf8`;

type Data = { [index: string]: Value };

export default class JsonStore extends Store {
  private _data?: Data;
  private readonly fileUrl: string;

  constructor(name: string, readonly rootDir: string) {
    super(name);
    this.fileUrl = path.resolve(rootDir, `${name}.json`);
  }

  private async loadData(): Promise<Data> {
    let data = this._data;
    if (data) {
      return data;
    }

    data = {};
    try {
      const text = await read(this.fileUrl, ENCODING);
      data = JSON.parse(text);
    } catch (e) {
      if (e.errno !== os.constants.errno.ENOENT) {
        throw e;
      }
    }

    this._data = data;
    return data!;
  }

  async get(key: string): Promise<Value> {
    return (await this.loadData())[key];
  }

  async save(key: string, value: Value): Promise<void> {
    const data = await this.loadData();
    data[key] = value;
    return write(this.fileUrl, JSON.stringify(this._data));
  }
}