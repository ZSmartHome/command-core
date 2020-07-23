import * as assert from 'assert';
import {Option} from '../../src/commands/light';

describe('Check exported values', () => {
  it('should export options', () => {
    assert.ok(Option);
  })
})
