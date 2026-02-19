QUnit.module('pwa / manifest / service worker', () => {
  QUnit.test('manifest.webmanifest is present and valid', async (assert) => {
    const done = assert.async()
    const res = await fetch('/manifest.webmanifest')
    assert.ok(res.ok, 'manifest.webmanifest served successfully')
    const json = await res.json()
    assert.strictEqual(json.name, 'Smart Learning for Independence', 'manifest name is correct')
    assert.strictEqual(json.start_url, './index.html', 'start_url is correct')
    assert.ok(Array.isArray(json.icons) && json.icons.length >= 3, 'manifest contains icons')    // manifest should include an SVG app icon (vector form)
    assert.ok(json.icons.some(i => i.type === 'image/svg+xml' || /\.svg$/.test(i.src)), 'manifest includes an SVG icon');    // check that the referenced icon files exist
    for (const icon of json.icons) {
      const r = await fetch('/' + icon.src)
      assert.ok(r.ok, `icon exists: ${icon.src}`)
    }
    done()
  })

  QUnit.test('service worker file and offline page exist', async (assert) => {
    const sw = await fetch('/sw.js')
    assert.ok(sw.ok, 'sw.js is available')
    const swText = await sw.text()
    assert.ok(/CACHE/.test(swText), 'sw.js contains CACHE constant')

    const offline = await fetch('/offline.html')
    assert.ok(offline.ok, 'offline.html is available')

    // favicon
    const favicon = await fetch('/assets/icons/favicon.ico')
    assert.ok(favicon.ok, 'favicon.ico is available')
  })
})
