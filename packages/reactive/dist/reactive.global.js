"use strict";
var VueReactive = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactive/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    effect: () => effect,
    reactive: () => reactive
  });

  // packages/reactive/src/effect.ts
  var activeEffect = void 0;
  var ReactiveEffect = class {
    constructor(fn) {
      this.fn = fn;
      this.parent = null;
      this.active = true;
      this.deps = [];
    }
    run() {
      if (!this.active) {
        this.fn();
      }
      try {
        this.parent = activeEffect;
        activeEffect = this;
        this.fn();
      } finally {
        activeEffect = this.parent;
      }
    }
  };
  function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
  }
  var targetMap = /* @__PURE__ */ new WeakMap();
  function tarck(target, type, key) {
    if (!activeEffect)
      return;
    let despMap = targetMap.get(target);
    if (!despMap) {
      targetMap.set(target, despMap = /* @__PURE__ */ new Map());
    }
    let dep = despMap.get(key);
    if (!dep) {
      despMap.set(key, dep = /* @__PURE__ */ new Set());
    }
    let shouldTrack = despMap.has(activeEffect);
    if (!shouldTrack) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }
  function trigger(target, type, key, newValue, olderValue) {
    const targetDep = targetMap.get(target);
    if (!targetDep)
      return;
    const effects = targetDep.get(key);
    effects && effects.forEach((effect2) => {
      if (effect2 !== activeEffect)
        effect2.run();
    });
  }

  // packages/shared/src/index.ts
  var isObject = (params) => {
    return typeof params === "object" ? true : false;
  };

  // packages/reactive/src/baseHandle.ts
  var mutableHandles = {
    get(target, key, receiver) {
      if (key === "__V__isReactive" /* IS_REACTIVE */) {
        return true;
      }
      tarck(target, "get", key);
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      let result = Reflect.set(target, key, value, receiver);
      if (oldValue !== value) {
        trigger(target, "set", key, value, oldValue);
      }
      return result;
    }
  };

  // packages/reactive/src/reactive.ts
  var cacheReactive = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    if (!isObject(target)) {
      return target;
    }
    if (target["__V__isReactive" /* IS_REACTIVE */]) {
      return target;
    }
    if (cacheReactive.has(target)) {
      return target;
    }
    const proxy = new Proxy(target, mutableHandles);
    cacheReactive.set(target, proxy);
    return proxy;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactive.global.js.map
