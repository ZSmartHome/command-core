import {ExecutionError} from '..';
import Yeelight from 'yeelight2';
import {Option} from '../executor/option';
import Executor from '../executor/executor';

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
  const timer = setTimeout(() =>
      fail(new ExecutionError(`Couldn't find lamp in ${LAMP_TIMEOUT}ms`)),
    LAMP_TIMEOUT);
  Yeelight.discover(function (myLight) {
    this.close();
    clearTimeout(timer);
    success(myLight);
  });
});


interface LightOption extends Option {
  action: (light: Yeelight.Light) => Promise<Yeelight.Light>
  doNotSave?: boolean
}

export class LightExecutor extends Executor<LightOption, Yeelight.Light> {
  constructor() {
    super(`Light`, {
        on: {label: `On 💡`, doNotSave: true, action: (it) => it.set_power(`on`)},
        off: {label: `Off 💡`, doNotSave: true, action: (it) => it.set_power(`off`)},
        bright: {label: `Bright ☀️`, action: (it) => it.set_bright(75)},
        normal: {label: `Питер 🌤️`, action: (it) => it.set_bright(50)},
        dark: {label: `Dark ☁️`, action: (it) => it.set_bright(30)},
        red: {label: `🔴`, action: (it) => it.set_rgb(0xFF0000)},
        blue: {label: `🔵`, action: (it) => it.set_rgb(0x0000FF)},
        green: {label: `🟢`, action: (it) => it.set_rgb(0x00FF00)},
        default: {label: `💡`, action: reset}
      }
    )
  }

  protected async execute(option: LightOption): Promise<Yeelight.Light> {
    let lamp: Yeelight.Light | undefined;
    try {
      lamp = await connectLamp();

      let promise = option.action(lamp).then(() => lamp!!);
      promise = !option.doNotSave ? promise.then((it) => it.set_default()) : promise;
      // TODO: Test finally and move on Node 10 and higher
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally
      // return promise.finally(() => lamp.exit());
      return await promise;
    } catch (e) {
      throw new ExecutionError(`Failed to execute command: ${e.message || e}`);
    } finally {
      if (lamp) {
        console.log(`Closing connection to lamp...`);
        lamp.exit();
        console.log(`Connection to lamp closed`);
      }
    }
  }

}

export const getExecutor = ():LightExecutor => new LightExecutor();
