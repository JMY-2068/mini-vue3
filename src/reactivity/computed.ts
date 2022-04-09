import { ReactiveEffect } from './effect'

class ComputedRefImpl {
    private _getter: any
    private _dirty: boolean = true
    private _value: any
    private _effect: any
    constructor(getter) {
        this._getter = getter
        this._effect= new ReactiveEffect(getter,()=>{
            !this._dirty&&(this._dirty=true)
        })
    }
    get value() {
        // 实现缓存功能,只调用一次,再次调用直接返回缓存值
        // 但是当依赖的响应式的值发生改变的时候,_dirty应该重置为true,因为需要重新执行run()获取新的值
        // 依赖的响应式的值发生改变的时候,会触发trigger,然后会判断是否有传入scheduler,所以可以在scheduler把_dirty重置为true
        if (this._dirty) {
            this._dirty = false
            this._value= this._effect.run()
        }
        return this._value
    }
}

export function computed(getter) {
    return new ComputedRefImpl(getter)
}
