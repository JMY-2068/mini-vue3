import { isObject } from '../shared'
import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
    patch(vnode, container)
}

function patch(vnode, container) {
    // 判断vnode是不是一个element
    if (typeof vnode.type === 'string') {
        processElement(vnode, container)
    } else if (isObject(vnode.type)) {
        processComponent(vnode, container)
    }
}

function processElement(vnode, container) {
    mountElement(vnode, container)
}

function mountElement(vnode, container) {
    const el = document.createElement(vnode.type)
    // string array
    const { children, props } = vnode
    if(typeof children === 'string') {
        el.textContent = children
    } else if (Array.isArray(children)) {
        mountChildren(vnode, el)
    }
    // props
    for (const key in props) {
        const val = props[key]
        el.setAttribute(key, val)
    }
    container.appendChild(el)
}

function mountChildren(vnode, container) {
    vnode.children.forEach(child => {
        patch(child, container)
    })
}

function processComponent(vnode, container) {
    mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode)
    setupComponent(instance)
    setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
    const subTree = instance.render()
    // vnode -> patch
    // vnode -> element -> mountElement
    patch(subTree, container)
}
