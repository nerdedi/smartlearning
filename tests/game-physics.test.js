QUnit.module('game physics helpers', () => {
  QUnit.test('rectsIntersect detects overlaps correctly', async (assert) => {
    const { rectsIntersect } = await import('../../../src/game/game.js')
    const a = { x: 0, y: 0, width: 50, height: 50 }
    const b = { x: 25, y: 25, width: 50, height: 50 }
    const c = { x: 100, y: 100, width: 10, height: 10 }

    assert.ok(rectsIntersect(a, b), 'a intersects b')
    assert.notOk(rectsIntersect(a, c), 'a does not intersect c')
  })

  QUnit.test(
    'playerOnPlatform identifies standing on platform',
    async (assert) => {
      const { playerOnPlatform } = await import('../../../src/game/game.js')
      const player = { x: 100, y: 180, width: 40, height: 60 }
      const platform = { x: 90, y: 240, width: 120, height: 20 }

      // feetY = 240 -> considered on top
      assert.ok(
        playerOnPlatform(player, platform),
        'player feet are on the platform'
      )

      // player above platform (gap)
      const player2 = { x: 100, y: 100, width: 40, height: 60 }
      assert.notOk(
        playerOnPlatform(player2, platform),
        'player not on platform'
      )
    }
  )

  QUnit.test('clamp restricts values', async (assert) => {
    const { clamp } = await import('../../../src/game/game.js')
    assert.equal(clamp(5, 0, 10), 5, 'within range stays same')
    assert.equal(clamp(-1, 0, 10), 0, 'below min clamps to min')
    assert.equal(clamp(20, 0, 10), 10, 'above max clamps to max')
  })
})
