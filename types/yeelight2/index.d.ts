// @docs https://www.typescriptlang.org/docs/handbook/modules.html#ambient-modules
declare module "yeelight2" {

  /**
   * [Yeelight description]
   * @docs http://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf
   */
  namespace Yeelight {
    /**
     * support two values: "sudden" and "smooth". If effect is "sudden",
     * then the color temperature will be changed directly to target value, under this case, the
     * third parameter "duration" is ignored. If effect is "smooth", then the color temperature will
     * be changed to target value in a gradual fashion, under this case, the total time of gradual
     * change is specified in third parameter "duration".
     */
    type Effect = 'sudden' | 'smooth';
    type FAST = 30;
    type SMOOTH = 500;
    type LONG = 1000;
    /**
     * specifies the total time of the gradual changing. The unit is
     * milliseconds. The minimum support duration is 30 milliseconds.
     */
    type Duration = FAST | SMOOTH | LONG;

    interface Light {
      toggle(): void

      set_power(mode: 'on' | 'off', effect?: Effect, duration?: Duration): Promise<any>

      set_default(): Promise<any>

      /**
       * set_rgb This method is used to change the color of a smart LED.
       * @param rgb is the target color, whose type is integer. It should be
       *                  expressed in decimal integer ranges from 0 to 16777215 (hex: 0xFFFFFF).
       * @param {[number]} effect    [Refer to "set_rgb" method.]
       * @param {[Duration]} duration  [Refer to "set_rgb" method.]
       */
      set_rgb(rgb: number, effect?: Effect, duration?: Duration): Promise<any>

      /**
       * set_ct_abx
       * This method is used to change the color temperature of a smart LED
       *
       * @param temperature is the target color temperature. The type is integer and
       *                 range is 1700 ~ 6500 (k).
       *
       * @param effect
       * @param duration
       */
      set_ct_abx(temperature: number, effect?: Effect, duration?: Duration): Promise<any>

      /**
       * [set_hsv This method is used to change the color of a smart LED]
       * @param {[number]} hue is the target hue value, whose type is integer.
       *                 It should be expressed in decimal integer ranges from 0 to 359.
       * @param {[number]} sat is the target saturation value whose type is integer. It's range is 0 to 100
       * @param {[Effect]} effect   [Refer to "set_hsv" method.]
       * @param {[Duration]} duration [Refer to "set_hsv" method.]
       */
      set_hsv(hue: number, sat: number, effect?: Effect, duration?: Duration): Promise<any>

      /**
       * [set_bright This method is used to change the brightness of a smart LED.]
       * @param {[number]} brightness is the target brightness. The type is integer and ranges
       *                   from 1 to 100. The brightness is a percentage instead of a absolute value.
       *                   100 means maximum brightness while 1 means the minimum brightness.
       * @param {[Effect]} effect     [Refer to "set_ct_abx" method.]
       * @param {[Duration]} duration   [Refer to "set_ct_abx" method.]
       */
      set_bright(brightness: number, effect?: Effect, duration?: Duration): Promise<any>

      /**
       * Closes connection and exits
       */
      exit(): void

      name: string
    }

    interface Closable {
      close(): void
    }
  }

  class Yeelight {
    static discover(callback: (this: Yeelight.Closable, light: Yeelight.Light) => void): void;

    static close(): void
  }

  export = Yeelight;
}
