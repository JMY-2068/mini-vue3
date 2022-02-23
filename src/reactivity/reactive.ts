import { mutableHandle, readonlyHandles } from './baseHandles'
export const enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly'
}

export function reactive(raw) {
    return createActiveObject(raw, mutableHandle)
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHandles)
}

export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadOnly(value) {
    return !!value[ReactiveFlags.IS_READONLY]
}

function createActiveObject(raw: any, baseHandles) {
    return new Proxy(raw, baseHandles)
}