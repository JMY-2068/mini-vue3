import { track, trigger } from './effect'

export function reactive(raw) {
    return new Proxy(raw, {
        get(target, key) {
            console.log('触发get')
            const res = Reflect.get(target, key)
            track(target, key)
            return res
        },
        set(target, key, value) {
            console.log('触发set')
            const res = Reflect.set(target, key, value)
            trigger(target, key)
            return res
        }
    })
}