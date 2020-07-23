import * as assert from 'assert';
import {suite, test} from 'mocha-typescript';
import {Option} from '../../src/commands/light';

@suite('Check exported values')
export default class {
  @test
  public 'should export options'() {
    assert(Option)
  }

}
