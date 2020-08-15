import {light, lightCommands} from '../../src';

describe(`Check exported values`, () => {
  it(`should throw on unknown commands`, async () => {
    // BC! You can't them parallel it's RaceCondition on port
    await expect(light(`test`)).rejects.toThrow(`Unsupported command: test`);
    await expect(light(`  test  `)).rejects.toThrow(`Unsupported command: test`);
    await expect(light(`unknown`)).rejects.toThrow(`Unsupported command: unknown`);
  })
  it(`should throw on empty command`, async () => {
    // BC! You can't them parallel it's RaceCondition on port
    await expect(light(``)).rejects.toThrow(`What should I do with Light?`);
    await expect(light(`    `)).rejects.toThrow(`What should I do with Light?`);
    await expect(light(`    `)).rejects.toThrow(`What should I do with Light?`);
  })
  it(`should check number of commands`, async () => {
    expect(Object.keys(lightCommands).length).toBe(9);
  })
})
