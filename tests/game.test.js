QUnit.module('game integration', () => {
  QUnit.test('nav link to Adventure exists', (assert) => {
    const link = document.getElementById('nav-game')
    assert.ok(link, 'Play (Adventure) nav link is present')
    assert.equal(
      link.getAttribute('href'),
      'game/index.html',
      'link points to the game page'
    )
  })
})
