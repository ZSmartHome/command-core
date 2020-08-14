export type Value = object | string | number | boolean | Value[];

export default abstract class Store {
  protected constructor(public readonly name: string) {}
  abstract save(key: string, value: Value): Promise<void>
  abstract get(key: string): Promise<Value>
}