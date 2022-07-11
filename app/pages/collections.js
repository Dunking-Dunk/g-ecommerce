import Page from '../classes/Page.js'
import Carousel from '../components/Carousel.js'

export default class Collections extends Page {
    constructor() {
        super({
            element: '.collections',
            elements: {
                carousel: '.products__carousel',
                carouselBtn: '.products__carousel__btn',
            },
            id: 'collections',
        })
        this.length = 0
    }

    create() {
        super.create()
        this.createCarousel()
    }

    createCarousel() {
        new Carousel({ buttons: this.elements.carouselBtn })
    }
}
