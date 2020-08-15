import {ExecutionError, getCameraExecutor} from '../../src/';
import * as Stream from 'stream';

describe(`Check camera executor`, () => {
  const fake = getCameraExecutor(`http://local.dev/camera`);
  const real = getCameraExecutor(`unreal`);

  it(`should throw on unknown commands`, async () => {
    // BC! You can`t them parallel it`s RaceCondition on port
    await expect(fake.run(`test`)).rejects.toThrow(`Unsupported command: test`);
    await expect(fake.run(`  test  `)).rejects.toThrow(`Unsupported command: test`);
    await expect(fake.run(`unknown`)).rejects.toThrow(`Unsupported command: unknown`);
  });
  it(`should throw on empty command`, async () => {
    // BC! You can`t them parallel it`s RaceCondition on port
    await expect(fake.run(``)).rejects.toThrow(`What should I do with Camera?`);
    await expect(fake.run(`    `)).rejects.toThrow(`What should I do with Camera?`);
  });
  it(`should always fail command`, async () => {
    // BC! You can`t them parallel it`s RaceCondition on port
    await expect(fake.run(`default`)).rejects.toThrow(ExecutionError);
  });
  xit(`should return stream with image`, async () => {
    // BC! You can`t them parallel it`s RaceCondition on port
    await expect(real.run(`default`)).resolves.toBeInstanceOf(Stream);
  });

  it(`should check number of commands`, async () => {
    expect(fake.commands.length).toBe(1);
  })
})
