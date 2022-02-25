import { isReadOnly, shallowReadonly } from "../reactive"

describe("shallowReactive", () => {
    it("should not make non-reactive properties reactive", () => {
        const props = shallowReadonly({ n: { foo: 1 } })
        expect(isReadOnly(props)).toBe(true)
        expect(isReadOnly(props.n)).toBe(false)
    })
})