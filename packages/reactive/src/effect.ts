/**
 *  是副作用函数，该函数会默认执行一次，当所依赖的数据发生变化的时候，会自动进行调用
 *  会接受一个回调函数，需要当依赖数据变化就重新执行，所以是为响应式的函数
 *  使用类去转化
 *  会进行依赖的收集 -> 实际上应该是要在getter中进行收集，
 *  因为当副作用函数执行的时候，会进行函数的执行，就会自动通过proxy的get返回值
 *  所以就可以在getter中进行依赖的收集
 */

export let activeEffect: undefined | ReactiveEffect | null = undefined;

class ReactiveEffect<T = any> {
  public parent: null | ReactiveEffect | undefined = null;

  // 用于标示是否需要依赖的收集
  public active = true;

  // 用于双向的依赖收集
  public deps: ReactiveEffect[] = [];

  constructor(public fn: () => T) {}
  run() {
    // 如果不是激活的状态，那么久仅仅是执行以下fn
    if (!this.active) {
      this.fn();
    }

    // 收集依赖，方便后面的渲染逻辑，将当前的effect保存下来

    // 为啥要这么做，如果effect只有一个函数，那没问题，但是如果effect是嵌套调用的呢
    // 就会触发问题： activeEffect不全部被指向所需要被执行的回调函数
    // 老版本解决方法： 使用栈的形式，将所有函数放进执行栈中，执行完即弹出，但是由于其本身的数据结构
    // 操作数组的变化是比较浪费性能的，所以原始的方法被更改为采取树结构进行操作
    // 方案： 在子级的对象中，parent会指向父级的对象，函数执行完毕即会对activeEffect重新赋值为parent

    try {
      this.parent = activeEffect;
      activeEffect = this;
      this.fn();
    } finally {
      activeEffect = this.parent;
    }
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn);

  // 默认执行一次
  _effect.run();
}

// 依赖
const targetMap = new WeakMap();
export function tarck(target: object, type: string, key: string) {
  if (!activeEffect) return;
  // 在这里进行依赖的收集
  // 先判断是否存在该对象，不存在就新建
  // 存在再判断是否存在key，不存在就新建
  // weakMap形式 -> {对象：Map:{name:Set}}
  // set用于多个key去重
  let despMap = targetMap.get(target);

  if (!despMap) {
    targetMap.set(target, (despMap = new Map()));
  }

  let dep = despMap.get(key);

  if (!dep) {
    despMap.set(key, (dep = new Set()));
  }

  let shouldTrack = despMap.has(activeEffect);

  if (!shouldTrack) {
    dep.add(activeEffect);

    // 让activeEffect记住对应的依赖，以便后续清理
    activeEffect.deps.push(dep);
  }
}

export function trigger(
  target: object,
  type: string,
  key: string,
  newValue: any,
  olderValue: any
) {
  //
  const targetDep = targetMap.get(target);
  if (!targetDep) return;

  // 找到依赖
  const effects = targetDep.get(key);

  // 如果存在 ，就遍历将收集来的依赖循环再次触发
  effects &&
    effects.forEach((effect) => {
      // 避免再次推入effect，防止爆栈
      if (effect !== activeEffect) effect.run();
    });
}
