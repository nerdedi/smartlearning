// @ts-nocheck
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
import { add } from './lib.js';

// UI wiring (module-safe)
const btn = document.getElementById(stryMutAct_9fa48("0") ? "" : (stryCov_9fa48("0"), 'actionBtn'));
const out = document.getElementById(stryMutAct_9fa48("1") ? "" : (stryCov_9fa48("1"), 'result'));
if (stryMutAct_9fa48("4") ? btn || out : stryMutAct_9fa48("3") ? false : stryMutAct_9fa48("2") ? true : (stryCov_9fa48("2", "3", "4"), btn && out)) {
  if (stryMutAct_9fa48("5")) {
    {}
  } else {
    stryCov_9fa48("5");
    btn.addEventListener(stryMutAct_9fa48("6") ? "" : (stryCov_9fa48("6"), 'click'), () => {
      if (stryMutAct_9fa48("7")) {
        {}
      } else {
        stryCov_9fa48("7");
        const value = add(2, 3);
        out.textContent = stryMutAct_9fa48("8") ? `` : (stryCov_9fa48("8"), `2 + 3 = ${value}`);
      }
    });
  }
}

// Expose for QUnit (without polluting global in prod)
if (stryMutAct_9fa48("11") ? typeof window === 'undefined' : stryMutAct_9fa48("10") ? false : stryMutAct_9fa48("9") ? true : (stryCov_9fa48("9", "10", "11"), typeof window !== (stryMutAct_9fa48("12") ? "" : (stryCov_9fa48("12"), 'undefined')))) {
  if (stryMutAct_9fa48("13")) {
    {}
  } else {
    stryCov_9fa48("13");
    window.__app__ = stryMutAct_9fa48("14") ? {} : (stryCov_9fa48("14"), {
      add
    });
  }
}