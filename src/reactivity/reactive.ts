import { mutableHandle, readonlyHandles } from './baseHandles'

export function reactive(raw) {
    return createActiveObject(raw, mutableHandle)
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHandles)
}

function createActiveObject(raw: any, baseHandles) {
    return new Proxy(raw, baseHandles)
}