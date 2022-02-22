import { extend } from '../shared'

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
        activeEffect = this
        console.log('执行run方法')
        return this._fn()
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
}

const targetMap = new Map()
// 收集依赖方法
export function track(target, key) {
    console.log('触发收集依赖')
    // target -> key -> dep
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        console.log('初始化targetMap')
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if (!dep) {
        console.log('初始化dep')
        dep = new Set()
        depsMap.set(key, dep)
    }

    if (!activeEffect) return
    console.log('将activeEffect添加到dep中')
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
}

// 触发依赖方法
export function trigger(target, key) {
    console.log('进入触发依赖')
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    for (const effect of dep) {
        if (effect.scheduler) {
            console.log('触发依赖, 并且执行scheduler')
            effect.scheduler()
        } else {
            effect.run()
        }
    }
}

let activeEffect
export function effect(fn, options: any = {}) {
    console.log('初始化ReactiveEffect')
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