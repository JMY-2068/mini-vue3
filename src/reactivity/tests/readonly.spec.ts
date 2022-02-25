import { readonly, isReadOnly, isReactive } from '../reactive'
describe('readonly', () => {
    it('should make nested values readonly', () => {
        // 不能被 set
        const original = {
            foo: 1,
            bar: {
                baz: 2
            }
        }
        const wrapped = readonly(original)
        expect(wrapped).not.toBe(original)
        expect(isReactive(wrapped)).toBe(false)
        expect(isReadOnly(wrapped)).toBe(true)
        expect(isReactive(original)).toBe(false)
        expect(isReadOnly(original)).toBe(false)
        expect(isReactive(wrapped.bar)).toBe(false)
        expect(isReadOnly(wrapped.bar)).toBe(true)
        expect(isReactive(original.bar)).toBe(false)
        expect(isReadOnly(original.bar)).toBe(false)
        expect(wrapped.foo).toBe(1)
    })

    it('should call console.warn when set', () => {
        console.warn = jest.fn()
        const user = readonly({
            age: 10
        })
        user.age = 11
        expect(console.warn).toBeCalled()
    })
})