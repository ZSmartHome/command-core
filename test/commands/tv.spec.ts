import {ExecutionError, tv, tvCommands} from '../../src';

describe(`Check exported values`, () => {
  it(`should throw on unknown commands`, async () => {
    // BC! You can`t them parallel it`s RaceCondition on port
    await expect(tv(`test`)).rejects.toThrow(`Unsupported command: test`);
    await expect(tv(`  test  `)).rejects.toThrow(`Unsupported command: test`);
    await expect(tv(`unknown`)).rejects.toThrow(`Unsupported command: unknown`);
  });
  it(`should throw on empty command`, async () => {
    // BC! You can`t them parallel it`s RaceCondition on port
    await expect(tv(``)).rejects.toThrow(`What should I do with TV?`);
    await expect(tv(`    `)).rejects.toThrow(`What should I do with TV?`);
    await expect(tv(`    `)).rejects.toThrow(`What should I do with TV?`);
  });
  it(`should always fail command`, async () => {
    // BC! You can`t them parallel it`s RaceCondition on port
    await expect(tv(`off`)).rejects.toThrow(ExecutionError);
  });
  it(`should check number of commands`, async () => {
    expect(Object.keys(tvCommands).length).toBe(5);
  })
})
