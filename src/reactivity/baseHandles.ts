import { track, trigger } from './effect'

const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)

function createGetter(isReadonly = false) {
    return function get(target, key) {
        const res = Reflect.get(target, key)
        if (!isReadonly) {
            track(target, key)
        }
        return res
    }
}
function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value)
        trigger(target, key)
        return res
    }
}

export const mutableHandle = {
    get,
    set
}

export const readonlyHandles = {
    get: readonlyGet,
    set(target, key, value) {
        console.warn(`key:${key} set 失败,因为target是readonly`, target)
        return true
    }
}