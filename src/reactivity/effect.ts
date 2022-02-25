import { extend } from '../shared'
let activeEffect
let shouldTrack
class ReactiveEffect {
    private _fn: any
    deps = []
    active = true
    onStop?: () => void
    constructor(fn, public scheduler?) {
        this._fn = fn
        this.scheduler = scheduler
    }
    run() {
        // _fn执行的时候会收集依赖
        // 所以如果是stop状态,直接调用fn
        if (!this.active) {
            return this._fn()
        }
        // 如果不是stop状态,将shouldTrack置为true,表示需要收集依赖
        shouldTrack = true
        activeEffect = this
        const result = this._fn()
        // 因为shouldTrack是全局变量,所以收集完后需要重置
        shouldTrack = false
        return result
    }
    stop() {
        if (this.active) {
            cleanUpEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false
        }

    }
}

function cleanUpEffect(effect) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    })
    // 因为dep已经清空了,所以deps也可以直接清空
    effect.deps.length = 0
}

function isTracking() {
    return shouldTrack && activeEffect !== undefined
}

const targetMap = new Map()
// 收集依赖方法
export function track(target, key) {
    if (!isTracking()) return
    // target -> key -> dep
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Set()
        depsMap.set(key, dep)
    }
    // 如果已经收集过则不再收集
    if (dep.has(activeEffect)) return
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
}

// 触发依赖方法
export function trigger(target, key) {
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}


export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler)
    extend(_effect, options)

    _effect.run()

    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect

    return runner
}

export function stop(runner) {
    runner.effect.stop()
}