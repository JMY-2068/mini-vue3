import { readonly, isReadOnly } from '../reactive'
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
        expect(isReadOnly(wrapped)).toBe(true)
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