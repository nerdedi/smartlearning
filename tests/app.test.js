QUnit.module('app', () => {
  QUnit.test('add() adds numbers', (assert) => {
    const { add } = window.__app__;
    assert.equal(add(2, 3), 5, '2 + 3 = 5');
    assert.equal(add('2', '3'), 5, 'string coercion handled');
  });
});
