import {execute} from '../../src/commands/light';

describe('Check exported values', () => {
  it('should throw on unknown commands', async () => {
    return Promise.all(
      [expect(execute('test')).rejects.toThrow(`Unsupported command: test`),
        expect(execute('  test  ')).rejects.toThrow(`Unsupported command: test`),
        expect(execute('unknown')).rejects.toThrow(`Unsupported command: unknown`)]
    )
  })
  it('should throw on empty command', async () => {
    await expect(execute('')).rejects.toThrow(`What should I do with Light?`);
    await expect(execute('    ')).rejects.toThrow(`What should I do with Light?`);
    await expect(execute('    ')).rejects.toThrow(`What should I do with Light?`);
  })
})
