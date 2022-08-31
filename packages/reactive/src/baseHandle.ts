import { tarck, trigger } from "./effect";

export const enum ReactiveFlags {
  IS_REACTIVE = "__V__isReactive",
}
export const mutableHandles = {
  get(target, key, receiver) {
    // 配合上面的枚举，处理避免再次代理proxy的方法
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }

    tarck(target, "get", key);

    // Q&A : 为什么不直接target[key] ?
    // 可以修改原始的this指向 -> 通过receiver
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    let oldValue = target[key];

    // 应用到了反射，对性能的影响比较大，这一点适用于任何语言
    // reflect.set会自动返回boolean来进行判断是否内容更改对错
    let result = Reflect.set(target, key, value, receiver);

    // 对比新值旧值，更新依赖
    if (oldValue !== value) {
      trigger(target, "set", key, value, oldValue);
    }

    return result;
  },
};
