import JsonStore from '../../src/store/json-store';

describe(`Check exported values`, () => {
  it(`should throw if directory is invalid`, async () => {
    expect(() => new JsonStore(`name`, `invalid`)).not.toThrow(`error`)
  })
})
