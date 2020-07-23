import * as assert from 'assert';
import {split} from '../src';

const NUMBERS = [`one`, `two`, `three`, `four`, `five`, `six`, `seven`, `eight`, `nine`, `ten`];

const assertSplit = (source: any[], ...rows: number[]) => {
  const result = split(source, ...rows);
  assert.strictEqual(result.length, rows.length);
  for (let i = 0; i < rows.length; i++) {
    const message = `Expected to have ${rows[i]} element(s) in a row ${i}, but seen ${result[i].length}`;
    assert.strictEqual(result[i].length, rows[i], message);
  }
};

describe(`Verify split util`, () => {
  it('should be single row', () => {
    assertSplit(NUMBERS, 10);
  });

  it(`should be two rows`, () => {
    assertSplit(NUMBERS, 5, 5);
  });

  it(`should split on two rows unequally`, () => {
    assertSplit(NUMBERS.slice(0, 5), 2, 3);
  });

  it(`should split on 3 rows`, () => {
    assertSplit(NUMBERS.slice(0, 5), 2, 2, 1);
  });

  it(`should be three rows`, () => {
    assertSplit(NUMBERS, 3, 3, 3, 1);
  });

  it(`should overflow last row`, () => {
    const result = split(NUMBERS, 2, 1);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].length, 2);
    assert.strictEqual(result[1].length, 8);
  });
});
