import each from 'lodash/each.js'
import GSAP from 'gsap'
import AsyncLoader from './AsyncLoader.js'

export default class Page {
    constructor({ element, elements, id }) {
        this.selector = element
        this.selectorChildren = {
            ...elements,
            preloader: '[data-src]',
        }
        this.id = id
        this.create()
    }

    create() {
        if (this.selector instanceof window.HTMLElement) {
            this.element = this.selector
        } else {
            this.element = document.querySelector(this.selector)
        }

        this.elements = {}

        if (this.selectorChildren) {
            each(this.selectorChildren, (selector, key) => {
                if (
                    selector instanceof window.HTMLElement ||
                    selector instanceof window.NodeList ||
                    Array.isArray(selector)
                ) {
                    this.elements[key] = selector
                } else {
                    this.elements[key] = document.querySelectorAll(selector)
                    if (this.elements[key].length === 0) {
                        this.elements[key] = null
                    } else if (this.elements[key].length === 1) {
                        this.elements[key] = this.element.querySelector(selector)
                    }
                }
            })
        }

        this.createAsyncLoader()
    }

    createAsyncLoader() {
        if (this.elements.preloader.length) {
            each(this.elements.preloader, (element) => {
                new AsyncLoader({ element })
            })
        } else {
            new AsyncLoader({ element: this.elements.preloader })
        }
    }

    show() {
        return new Promise((resolve) => {
            this.animationIn = GSAP.timeline({})
            this.animationIn.fromTo(
                this.element,
                {
                    autoAlpha: 0,
                    y: '100%',
                },
                {
                    autoAlpha: 1,
                    duration: 1,
                    y: '0',
                    stagger: 0.2,
                }
            )
            this.animationIn.call((_) => {
                this.addEventListeners()
            })
        })
    }

    hide() {
        return new Promise((resolve) => {
            this.animationOut = GSAP.timeline()
            this.animationOut.to(this.element, {
                autoAlpha: 0,
                onComplete: resolve,
            })
        })
    }

    addEventListeners() {}
}
