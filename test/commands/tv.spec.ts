import {execute} from '../../src/commands/tv';
import {ExecutionError} from '../../src';

describe('Check exported values', () => {
  it('should throw on unknown commands', async () => {
    // BC! You can't them parallel it's RaceCondition on port
    await expect(execute('test')).rejects.toThrow(`Unsupported command: test`);
    await expect(execute('  test  ')).rejects.toThrow(`Unsupported command: test`);
    await expect(execute('unknown')).rejects.toThrow(`Unsupported command: unknown`);
  });
  it('should throw on empty command', async () => {
    // BC! You can't them parallel it's RaceCondition on port
    await expect(execute('')).rejects.toThrow(`What should I do with TV?`);
    await expect(execute('    ')).rejects.toThrow(`What should I do with TV?`);
    await expect(execute('    ')).rejects.toThrow(`What should I do with TV?`);
  });
  it('should always fail command', async () => {
    // BC! You can't them parallel it's RaceCondition on port
    await expect(execute('off')).rejects.toThrow(ExecutionError);
  });
})
