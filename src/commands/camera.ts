import Executor from '../executor/executor';
import {Stream} from 'stream';
import {Option} from '../executor/option';
import {get} from "http";
import {ExecutionError} from '..';

export class CameraExecutor extends Executor<Option, Stream> {
  constructor(private url: string) {
    super(`Camera`, {
      default: {label: `One shot 📷`}
    });
  }

  protected async execute(_: Option): Promise<Stream> {
    return new Promise((resolve, reject) => {
      get(this.url, (response) => {
        const statusCode = response.statusCode;
        if (statusCode !== 200) {
          reject(new ExecutionError(`Failed to fetch media. Response code: ${statusCode}`));
        }
        // @ts-ignore
        response.path = `camera.jpg`; // NB! Due to issue in library check set this always
        resolve(response);
      }).on(`error`, (e) => {
        reject(new ExecutionError(`Requested failed: ${e.message}`));
      });
    })
  }
}

export const getExecutor = (url:string) => new CameraExecutor(url);