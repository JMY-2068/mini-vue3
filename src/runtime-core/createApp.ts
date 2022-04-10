import { render } from './renderer'
import { createVNode } from './vnode'

export function createApp(rootComponent){
    return {
        mount(rootContainer){
            // component -> vnode
            const vnode = createVNode(rootComponent)
            // vnode -> dom
            render(vnode,rootContainer)
        }
    }
}

