// @ts-nocheck
// Minimal "network-first" with cache fallback
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
const CACHE = stryMutAct_9fa48("17") ? "" : (stryCov_9fa48("17"), 'smartlearning-v1');
const CORE_ASSETS = stryMutAct_9fa48("18") ? [] : (stryCov_9fa48("18"), [stryMutAct_9fa48("19") ? "" : (stryCov_9fa48("19"), '/'), stryMutAct_9fa48("20") ? "" : (stryCov_9fa48("20"), '/index.html'), stryMutAct_9fa48("21") ? "" : (stryCov_9fa48("21"), '/styles.css'), stryMutAct_9fa48("22") ? "" : (stryCov_9fa48("22"), '/app.js'), stryMutAct_9fa48("23") ? "" : (stryCov_9fa48("23"), '/manifest.webmanifest')]);
self.addEventListener(stryMutAct_9fa48("24") ? "" : (stryCov_9fa48("24"), 'install'), event => {
  if (stryMutAct_9fa48("25")) {
    {}
  } else {
    stryCov_9fa48("25");
    event.waitUntil(caches.open(CACHE).then(stryMutAct_9fa48("26") ? () => undefined : (stryCov_9fa48("26"), c => c.addAll(CORE_ASSETS))));
  }
});
self.addEventListener(stryMutAct_9fa48("27") ? "" : (stryCov_9fa48("27"), 'activate'), event => {
  if (stryMutAct_9fa48("28")) {
    {}
  } else {
    stryCov_9fa48("28");
    event.waitUntil(caches.keys().then(stryMutAct_9fa48("29") ? () => undefined : (stryCov_9fa48("29"), keys => Promise.all(stryMutAct_9fa48("30") ? keys.map(k => caches.delete(k)) : (stryCov_9fa48("30"), keys.filter(stryMutAct_9fa48("31") ? () => undefined : (stryCov_9fa48("31"), k => stryMutAct_9fa48("34") ? k === CACHE : stryMutAct_9fa48("33") ? false : stryMutAct_9fa48("32") ? true : (stryCov_9fa48("32", "33", "34"), k !== CACHE))).map(stryMutAct_9fa48("35") ? () => undefined : (stryCov_9fa48("35"), k => caches.delete(k))))))));
  }
});
self.addEventListener(stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), 'fetch'), event => {
  if (stryMutAct_9fa48("37")) {
    {}
  } else {
    stryCov_9fa48("37");
    const {
      request
    } = event;
    event.respondWith(fetch(request).then(res => {
      if (stryMutAct_9fa48("38")) {
        {}
      } else {
        stryCov_9fa48("38");
        const copy = res.clone();
        caches.open(CACHE).then(stryMutAct_9fa48("39") ? () => undefined : (stryCov_9fa48("39"), c => c.put(request, copy)));
        return res;
      }
    }).catch(stryMutAct_9fa48("40") ? () => undefined : (stryCov_9fa48("40"), () => caches.match(request))));
  }
});