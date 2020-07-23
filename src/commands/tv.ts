import {shell} from '../util';
import {Command, OptionLike, run, toCommands} from './option';

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

export const commands: { [command: string]: Command<string> } =
  toCommands<string, string, OptionLike<string>>({
    on: {label: `On 💡`, value: `on 0`},
    off: {label: `Off 💡`, value: `standby 0`},

    chromecast: {label: `Chromecast 📽️`, value: `tx 4F:82:10:00`},
    raspberry: {label: `Raspberry 🖥️`, value: `tx 4F:82:20:00`},
    hdmi: {label: `HDMi 💻`, value: `tx 4F:82:30:00`},
  }, (option: OptionLike<string>) => () => cec(option.value));


export const execute = async (command: string) => run(`TV`, commands, command);
