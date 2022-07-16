import Component from '../classes/Component.js'
import each from 'lodash/each.js'
import GSAP from 'gsap'
import { split } from '../utils/text.js'

export default class Preloader extends Component {
    constructor() {
        super({
            element: '.preloader',
            elements: {
                wrapper: '.preloader__wrapper',
                number: '.preloader__number',
                text: '.preloader__text',
                images: document.querySelectorAll('img'),
            },
        })
        split({
            element: this.elements.text,
            expression: '<br>',
        })

        split({
            element: this.elements.text,
            expression: '<br>',
        })

        this.elements.textSpans = this.elements.text.querySelectorAll('span span')

        this.length = 0
        this.createLoader()
    }

    createLoader() {
        console.log(this.elements.images.length)
        if (this.elements.images.length === 0) {
            this.elements.number.innerHTML = '100%'
            this.onLoaded()
        } else {
            each(this.elements.images, (element) => {
                element.src = element.getAttribute('data-src')
                element.onload = () => this.onAssetLoaded()
            })
        }
    }

    onAssetLoaded() {
        this.length += 1
        this.percent = this.length / this.elements.images.length
        this.elements.number.innerHTML = `${Math.round(this.percent * 100)}%`

        if (this.percent === 1) {
            this.onLoaded()
        }
    }

    onLoaded() {
        return new Promise((resolve) => {
            this.emit('completed')
            this.animateOut = GSAP.timeline({
                delay: 2,
            })

            this.animateOut.to(this.elements.textSpans, {
                y: '100%',
                duration: 1.5,
                ease: 'expo.out',
                autoAlpha: 0,
                stagger: 0.1,
            })

            this.animateOut.to(
                this.elements.number,
                {
                    y: '100%',
                    duration: 1.5,
                    ease: 'expo.out',
                    autoAlpha: 0,
                    stagger: 0.3,
                },
                '-=1.0'
            )
            this.animateOut.to(this.element, {
                autoAlpha: 0,
                duration: 1.5,
            })
            this.animateOut.call(() => {
                this.destroy()
            })
        })
    }

    destroy() {
        this.element.parentNode.removeChild(this.element)
    }
}
