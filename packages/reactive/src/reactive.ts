import { isObject } from "@vue/shared";
import { ReactiveFlags, mutableHandles } from "./baseHandle";

// 缓存响应式对象
let cacheReactive = new WeakMap();

/**
 * @param params 待转换的变量
 */
export function reactive(target: unknown) {
  if (!isObject(target)) {
    return target;
  }

  // 本身是响应式对象，直接返回
  // 非响应式对象则不存在该属性
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }

  // 缓存中存在该对象，返回
  if (cacheReactive.has(target as object)) {
    return target;
  }

  // 进行代理
  const proxy = new Proxy(target as object, mutableHandles);

  // 进行缓存
  cacheReactive.set(target as object, proxy);

  return proxy;
}
