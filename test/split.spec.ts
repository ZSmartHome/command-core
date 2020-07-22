import * as assert from 'assert';
import {suite, test} from 'mocha-typescript';
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

@suite('Verify split util')
export default class {
  @test
  public 'should be single row'() {
    assertSplit(NUMBERS, 10);
  }

  @test
  public 'should be two rows'() {
    assertSplit(NUMBERS, 5, 5);
  }

  @test
  public 'should split on two rows unequally'() {
    assertSplit(NUMBERS.slice(0, 5), 2, 3);
  }

  @test
  public 'should split on 3 rows'() {
    assertSplit(NUMBERS.slice(0, 5), 2, 2, 1);
  }

  @test
  public 'should be three rows'() {
    assertSplit(NUMBERS, 3, 3, 3, 1);
  }

  @test
  public 'should overflow last row'() {
    const result = split(NUMBERS, 2, 1);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].length, 2);
    assert.strictEqual(result[1].length, 8);
  }
}