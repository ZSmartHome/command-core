import {shell} from '../util';
import Executor from '../executor/executor';
import {Option} from '../executor/option';

/*
# Switch on
  echo "on 0" | cec-client -s
# Switch off
  echo "standby 0" | cec-client -s
# Switch HDMI port to 1
  echo "tx 4F:82:10:00" | cec-client -s
*/
const cec = (command: string): Promise<string> =>
  shell(`echo "${command}" | cec-client -o Raspberry -s -d 1`)

interface StringOption extends Option {
  value: string
}

export class TVExecutor extends Executor<StringOption, string> {
  constructor() {
    super(`TV`, {
      on: {label: `On 💡`, value: `on 0`},
      off: {label: `Off 💡`, value: `standby 0`},

      chromecast: {label: `Chromecast 📽️`, value: `tx 4F:82:10:00`},
      raspberry: {label: `Raspberry 🖥️`, value: `tx 4F:82:20:00`},
      hdmi: {label: `HDMi 💻`, value: `tx 4F:82:30:00`},
    });
  }

  protected async execute(option: StringOption): Promise<string> {
    return cec(option.value);
  }
}

export const getExecutor = (): TVExecutor => new TVExecutor();
