import { effect, stop } from '../effect'
import { reactive } from '../reactive'

describe('effect', () => {
    it('happy path', () => {
        const user = reactive({
            age: 10
        })

        let nextAge
        effect(() => {
            nextAge = user.age + 1
        })

        expect(nextAge).toBe(11)

        // update
        user.age++
        expect(nextAge).toBe(12)
    })

    it('should return runner when call effect', () => {
        // 1.effect(fn) -> function(runner) -> fn -> return
        let foo = 10
        const runner = effect(() => {
            foo++
            return 'foo'
        })
        expect(foo).toBe(11)
        const r = runner()
        expect(foo).toBe(12)
        expect(r).toBe('foo')
    })

    it('scheduler', () => {
        // 1.通过effect 的第二个参数给定的一个scheduler 的fn
        // 2. effect 第一次执行的时候还会执行fn
        // 3.当响应式对象set update 不会执行fn而是执行scheduler
        // 4.如果说当执行runner 的时候，会再次的执行fn
        let dummy
        let run
        const scheduler = jest.fn(() => {
            run = runner
        })
        const obj = reactive({ foo: 1 })
        const runner = effect(
            () => {
                dummy = obj.foo
            },
            { scheduler }
        )
        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        // should be called on first trigger
        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)
        // // should not run yet
        expect(dummy).toBe(1)
        // // manually run
        run()
        // // should have run
        expect(dummy).toBe(2)
    })

    it('stop', () => {
        // 1.给定一个stop函数,传入effect返回的runner
        // 2.当调用stop(runner)后,响应式的值发生改变,dummy不会发生更新,即effect(fn)的fn并不会执行
        // 3.再次调用runner(),dummy的值更新到最新
        let dummy
        const obj = reactive({ prop: 1 })
        const runner = effect(() => {
            dummy = obj.prop
        })
        obj.prop = 2
        expect(dummy).toBe(2)
        stop(runner)
        // obj.prop = 3
        // 此时换成obj.prop++会导致测试不通过,原因是obj.prop++会同时触发get,导致重新收集依赖
        obj.prop++
        expect(dummy).toBe(2)

        // stopped effect should still be manually callable
        runner()
        expect(dummy).toBe(3)
    })

    it('onStop', () => {
        const obj = reactive({
            foo: 1
        })
        const onStop = jest.fn()
        let dummy
        const runner = effect(
            () => {
                dummy = obj.foo
            },
            {
                onStop,
            }
        )

        stop(runner)
        expect(onStop).toBeCalledTimes(1)
    })

})