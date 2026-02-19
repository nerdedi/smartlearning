QUnit.module('game logic', () => {
  QUnit.test('calculateStats aggregates correctly', async (assert) => {
    const { calculateStats } = await import('../../../src/game/game.js')
    const progress = [
      {
        type: 'level',
        stars: 2,
        badge_earned: true,
        score: 100,
        completed: true,
      },
      {
        type: 'level',
        stars: 1,
        badge_earned: false,
        score: 50,
        completed: false,
      },
      {
        type: 'other',
        stars: 1,
        badge_earned: false,
        score: 10,
        completed: true,
      },
    ]

    const stats = calculateStats(progress)
    assert.equal(stats.totalStars, 3, 'sums stars correctly')
    assert.equal(stats.totalBadges, 1, 'counts badges')
    assert.equal(stats.totalPoints, 150, 'sums points')
    assert.equal(
      stats.completedLevels,
      1,
      'counts completed levels only for type=level',
    )
  })

  QUnit.test(
    'saveProgress persists to localStorage (fallback)',
    async (assert) => {
      const mod = await import('../../../src/game/game.js')
      localStorage.removeItem('sli-player-progress')

      await mod.saveProgress({
        type: 'level',
        world_id: 99,
        level_id: 1,
        stars: 2,
        score: 250,
        completed: true,
      })

      const saved = JSON.parse(
        localStorage.getItem('sli-player-progress') || '[]',
      )
      assert.ok(
        Array.isArray(saved) && saved.length > 0,
        'progress saved in localStorage',
      )
      const entry = saved.find((p) => p.world_id === 99 && p.level_id === 1)
      assert.ok(entry, 'saved progress entry exists')
      assert.equal(entry.score, 250, 'score saved')
    },
  )
})
