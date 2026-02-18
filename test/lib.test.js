import QUnit from 'qunit';
import { add } from '../src/lib.js';

QUnit.test('add() works (node)', (assert) => {
  assert.equal(add(2, 3), 5, '2 + 3 = 5');
  assert.equal(add('2', '3'), 5, 'string coercion handled');
});

// Test app.js in a Node environment by providing minimal `window`/`document` mocks
QUnit.test('app.js wires UI and exposes window.__app__', async (assert) => {
  const oldWindow = global.window;
  const oldDocument = global.document;

  try {
    // mock elements
    let clickHandler;
    const mockBtn = {
      addEventListener: (evt, cb) => {
        if (evt === 'click') clickHandler = cb
      }
    }
    const mockOut = { textContent: '' }

    // minimal globals expected by src/app.js
    global.window = {}
    global.document = {
      getElementById: (id) => (id === 'actionBtn' ? mockBtn : id === 'result' ? mockOut : null)
    }

    // dynamic import so the module runs with our mocks in place (cache-bust to allow re-import)
    await import(`../src/app.js?present-${Date.now()}`)

    assert.ok(global.window.__app__, 'window.__app__ is defined')
    assert.equal(typeof global.window.__app__.add, 'function', 'add() is exposed')

    // simulate click and check DOM update
    assert.ok(typeof clickHandler === 'function', 'click handler was registered')
    clickHandler()
    assert.equal(mockOut.textContent, '2 + 3 = 5', 'click updates result text')
  } finally {
    global.window = oldWindow
    global.document = oldDocument
  }
})

QUnit.test('app.js does NOT throw or register handler when actionBtn is missing', async (assert) => {
  const oldWindow = global.window;
  const oldDocument = global.document;

  try {
    global.window = {}
    global.document = {
      getElementById: (id) => (id === 'actionBtn' ? null : id === 'result' ? { textContent: '' } : null)
    }

    // import a fresh module instance (cache-bust) and ensure it does not throw
    await import(`../src/app.js?missing-btn-${Date.now()}`)
    assert.ok(true, 'module import did not throw when actionBtn is missing')
  } finally {
    global.window = oldWindow
    global.document = oldDocument
  }
})

QUnit.test('app.js does not set window.__app__ when window is not defined', async (assert) => {
  const oldWindow = global.window;
  const oldDocument = global.document;

  try {
    // ensure window is undefined
    delete global.window
    global.document = { getElementById: () => null }

    // import a fresh module instance (cache-bust) and ensure it does not throw
    await import(`../src/app.js?no-window-${Date.now()}`)
    assert.strictEqual(typeof global.window, 'undefined', 'window remains undefined after import')
  } finally {
    global.window = oldWindow
    global.document = oldDocument
  }
})

// Test service worker behavior by mocking `self`, `caches` and `fetch`.
QUnit.test('sw.js registers install/activate/fetch handlers and interacts with cache', async (assert) => {
  const oldSelf = global.self
  const oldCaches = global.caches
  const oldFetch = global.fetch

  try {
    const handlers = {}
    global.self = {
      addEventListener: (name, cb) => {
        handlers[name] = cb
      }
    }

    // spies / fakes for caches API
    let openedCacheName = null
    let addedAssets = null
    let deletedKeys = []
    let matchRequested = null
    let putCalledWith = null

    global.caches = {
      open: async (name) => {
        openedCacheName = name
        return {
          addAll: async (assets) => {
            addedAssets = assets
          },
          put: async (req, res) => {
            putCalledWith = [req, res]
          }
        }
      },
      keys: async () => ['old-cache', 'smartlearning-v1'],
      delete: async (k) => {
        deletedKeys.push(k)
        return true
      },
      match: async (req) => {
        matchRequested = req
        return 'CACHE_MATCH'
      }
    }

    // make a controllable fetch
    let fetchCalledWith = null
    global.fetch = async (req) => {
      fetchCalledWith = req
      return { clone: () => 'CLONE', ok: true }
    }

    // import the service worker module (it will register handlers on `self`)
    await import('../src/sw.js')

    // ---- install handler ----
    assert.ok(typeof handlers.install === 'function', 'install handler registered')
    let installPromise
    handlers.install({
      waitUntil: (p) => (installPromise = p)
    })
    await installPromise
    assert.equal(openedCacheName, 'smartlearning-v1', 'install opens correct cache')
    assert.deepEqual(
      addedAssets,
      ['/', '/index.html', '/styles.css', '/app.js', '/manifest.webmanifest'],
      'install adds exact core assets'
    )

    // ---- activate handler ----
    assert.ok(typeof handlers.activate === 'function', 'activate handler registered')
    let activatePromise
    handlers.activate({
      waitUntil: (p) => (activatePromise = p)
    })
    await activatePromise
    assert.ok(deletedKeys.includes('old-cache'), 'activate removed old caches')
    assert.notOk(deletedKeys.includes('smartlearning-v1'), 'activate does not delete the active cache')

    // ---- fetch handler (success path) ----
    assert.ok(typeof handlers.fetch === 'function', 'fetch handler registered')
    let fetchResponsePromise
    const fakeRequest = { url: '/some-resource' }
    handlers.fetch({
      request: fakeRequest,
      respondWith: (p) => (fetchResponsePromise = p)
    })

    const fetchResult = await fetchResponsePromise
    assert.equal(fetchCalledWith, fakeRequest, 'fetch called with request')
    assert.equal(fetchResult.clone?.(), 'CLONE', 'fetch handler returned fetch response')
    assert.deepEqual(putCalledWith, [fakeRequest, 'CLONE'], 'fetch handler cached the cloned response')

    // ---- fetch handler (failure -> cache.match path) ----
    // make fetch reject
    global.fetch = async () => Promise.reject(new Error('network'))
    let failResponsePromise
    handlers.fetch({
      request: fakeRequest,
      respondWith: (p) => (failResponsePromise = p)
    })
    const failResult = await failResponsePromise
    assert.equal(failResult, 'CACHE_MATCH', 'on network failure fetch falls back to cache.match')
    assert.equal(matchRequested, fakeRequest, 'cache.match was called with the request')
  } finally {
    global.self = oldSelf
    global.caches = oldCaches
    global.fetch = oldFetch
  }
})
