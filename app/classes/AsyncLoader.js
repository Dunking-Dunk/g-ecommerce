import Component from './Component.js'

export default class AsyncLoader extends Component {
    constructor({ element }) {
        super({ element })
        this.createObserver()
    }

    createObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (!this.element.getAttribute('src')) {
                        const src = this.element.getAttribute('data-src')
                        this.element.setAttribute('src', src)
                    }
                    this.element.classList.add('loaded')
                }
            })
        })
        this.observer.observe(this.element)
    }
}
