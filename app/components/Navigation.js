import Component from '../classes/Component.js'
import GSAP from 'gsap'

export default class Navigation extends Component {
    constructor({ template }) {
        super({
            element: '.navigation',
            elements: {
                items: '.navigation__list__item',
            },
        })
        this.onChange(template)
    }

    onChange(template) {
        if (template === 'home') {
            GSAP.to(this.elements.items[0], {
                autoAlpha: 0,
                duration: 0.75,
            })
            GSAP.to(this.elements.items[1], {
                autoAlpha: 1,
                duration: 0.75,
            })
        }

        if (template === 'collections') {
            GSAP.to(this.elements.items[1], {
                autoAlpha: 1,
                duration: 0.75,
            })
            GSAP.to(this.elements.items[0], {
                autoAlpha: 0,
                duration: 0.75,
            })
        }

        if (template === 'detail') {
            GSAP.to(this.elements.items[0], {
                autoAlpha: 1,
                duration: 0.75,
            })
            GSAP.to(this.elements.items[1], {
                autoAlpha: 0,
                duration: 0.75,
            })
        }
    }
}
