import {ExecutionError} from '..';
import * as Yeelight from 'yeelight2';
import {Action, Command, execute as executeCommand, Executor, OptionLike} from './option';

// https://en.wikipedia.org/wiki/Color_temperature
const TEMPERATURE = {
  match: 1700,
  candle: 1850,
  lamp: 2400,
  white_lamp: 2550,
  soft: 2700,
  warm: 3000,
  cold_white: 6500,
};

// Default yellow not very bright light
const DEFAULT_STATE = {
  bright: 75,
  ct: TEMPERATURE.warm,
  rgb: 0xFBFF8D,
  hue: 62,
  sat: 44,
};

const reset = (lamp: Yeelight.Light) => Promise.all([
  lamp.set_bright(DEFAULT_STATE.bright),
  lamp.set_ct_abx(DEFAULT_STATE.ct),
  // If we set color temperature, then rgb and hsv is reset

  // lamp.set_rgb(DEFAULT_STATE.rgb),
  // lamp.set_hsv(DEFAULT_STATE.hue, DEFAULT_STATE.sat),
]).then(() => lamp);

const LAMP_TIMEOUT = 2000;
const connectLamp = () => new Promise<Yeelight.Light>((success, fail) => {
  const timer = setTimeout(() => fail(new ExecutionError(`Couldn't find lamp in ${LAMP_TIMEOUT}ms`)), LAMP_TIMEOUT);
  Yeelight.discover(function (myLight) {
    this.close();
    clearTimeout(timer);
    success(myLight);
  });
});


type LightExecutor = Executor<Yeelight.Light>;

class LightAction extends Action<Yeelight.Light> {

  constructor(executor: LightExecutor, private save: boolean) {
    super(executor);
  }

  async execute(): Promise<Yeelight.Light> {
    const lamp = await connectLamp();

    let promise = this.executor(lamp);
    promise = this.save ? promise.then((it) => it.set_default()) : promise;
    // TODO: Test finally and move on Node 10 and higher
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally
    // return promise.finally(() => lamp.exit());
    try {
      return await promise;
    } finally {
      lamp.exit();
    }
  }

}

interface Option extends OptionLike<Yeelight.Light> {
  doNotSave?: boolean
}

const toCommands = (raw: { [command: string]: Option }): { [command: string]: Command<Yeelight.Light> } => {
  const result: { [command: string]: Command<Yeelight.Light> } = {}
  for (const command of Object.keys(raw)) {
    const value: Option = raw[command];
    const executor = value.executor;
    result[command] = {
      command,
      action: new LightAction(executor, !value.doNotSave),
      label: value.label || command,
      description: value.description || (value.label || command),
    };
  }
  return result;
}
export const commands: { [command: string]: Command<Yeelight.Light> } = Object.freeze(toCommands({
  on: {label: `On 💡`, doNotSave: true, executor: (it) => it.set_power(`on`)},
  off: {label: `Off 💡`, doNotSave: true, executor: (it) => it.set_power(`off`)},
  bright: {label: `Bright ☀️`, executor: (it) => it.set_bright(75)},
  normal: {label: `Питер 🌤️`, executor: (it) => it.set_bright(50)},
  dark: {label: `Dark ☁️`, executor: (it) => it.set_bright(30)},
  red: {label: `🔴`, executor: (it) => it.set_rgb(0xFF0000)},
  blue: {label: `🔵`, executor: (it) => it.set_rgb(0x0000FF)},
  green: {label: `🟢`, executor: (it) => it.set_rgb(0x00FF00)},
  reset: {label: `Комнатный 💡`, executor: reset}
}));


export type CommandKey = keyof typeof commands;

export const execute = async (command: CommandKey): Promise<Yeelight.Light> => executeCommand(`Light`, commands, command);
