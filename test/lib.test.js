import { test } from 'qunit';
import { add } from '../src/lib.js';

test('add() works (node)', (assert) => {
  assert.equal(add(2, 3), 5, '2 + 3 = 5');
  assert.equal(add('2', '3'), 5, 'string coercion handled');
});
