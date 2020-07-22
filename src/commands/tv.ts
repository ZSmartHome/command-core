import {shell} from '../util';
import {ExecutionError} from '../errors/execution-error';

/*
# Switch on
  echo "on 0" | cec-client -s
# Switch off
  echo "standby 0" | cec-client -s
# Switch HDMI port to 1
  echo "tx 4F:82:10:00" | cec-client -s
*/
const TvCommand: { [command: string]: string } = {
  on: `on 0`,
  off: `tx 4F:36`,

  chromecast: `tx 4F:82:10:00`,
  raspberry: `tx 4F:82:20:00`,
  hdmi: `tx 4F:82:30:00`,
};

export const execute = async (command: string) => {
  if (!command) {
    throw new ExecutionError(`What should I do with TV?`);
  }
  const action = TvCommand[command];
  if (!action) {
    const message = `Unsupported command: ${command}`;
    console.error(message);
    throw new ExecutionError(`Unsupported command: ${command}`);
  }

  return shell(`echo "${action}" | cec-client -o Raspberry -s -d 1`);
};