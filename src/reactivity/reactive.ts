import { mutableHandle, readonlyHandles, shallowReadonlyHandles, shallowReactiveHandles } from './baseHandles'
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly'
}

export function reactive(raw) {
    return createActiveObject(raw, mutableHandle)
}

export function shallowReactive(raw) {
    return createActiveObject(raw, shallowReactiveHandles)
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHandles)
}

export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReadonlyHandles)
}

export function isReactive(value) {
    // value可能是一个普通对象,导致返回undefined, 所以通过!!将undefined转换为boolean值
    return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadOnly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}


function createActiveObject(raw: any, baseHandles) {
    return new Proxy(raw, baseHandles)
}