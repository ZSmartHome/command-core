import {exec} from 'child_process';
import {ExecutionError} from './errors/execution-error';

export const shell = (command: string): Promise<string> => {
  return new Promise((onSuccess, onFail) => {
    console.log(`Calling command: "${command}"`);
    exec(command,
      (error: Error | null, stdout: string, stderr: string) => {
        console.log(`Command: "${command}" finished`);
        if (error) {
          console.log(`Got error: "${error.message}"`);
          onFail(new ExecutionError(`exec error: ${error.message}`));
          return;
        }
        const result = [`Command complete:`]
        if (stdout) {
          const text = `stdout: ${stdout}`;
          console.log(text);
          result.push(text);
        }
        if(stderr) {
          const text = `stderr: ${stdout}`;
          console.log(text);
          result.push(text);
        }
        onSuccess(result.join(`\n`));
      });
  });
};

export const split = (buttons: any[], ...rows: number[]): any[][] => {
  if (rows.length <= 0 || rows.length > 10) {
    throw new Error(`Invalid rows argument. Should be interval of 0..10`);
  }

  const result: any[][] = [[]];

  let currentRow = 0; // will be increased to 0 on first element
  let rowCount = rows[currentRow];
  for (let i = 0; i < buttons.length; i++) {
    if (i >= rowCount) {
      const nextRow = rows[currentRow + 1];
      if (nextRow > 0) {
        currentRow++;
        // move to next row
        rowCount += nextRow;
        result[currentRow] = [];
      } else {
        // overflow current row
        rowCount += buttons.length;
      }
    }
    result[currentRow].push(buttons[i]);
  }
  return result;
};

type Pair<T> = { [s: string]: T } | { [n: number]: T };
export const each = <T>(o: Pair<T>): [string | number, T][] => Object.entries(o);
