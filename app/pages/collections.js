import Page from '../classes/Page.js'
import Carousel from '../components/Carousel.js'

export default class Collections extends Page {
    constructor() {
        super({
            element: '.collections',
            elements: {
                carousel: '.products__carousel',
                carouselBtn: '.products__carousel__btn',
                slider: '.collections__slider',
                sliderElement: '.collections__slider__element',
            },
            id: 'collections',
        })
    }
    create() {
        super.create()
        this.createCarousel()
    }
    createCarousel() {
        new Carousel({ buttons: this.elements.carouselBtn, slider: this.elements.sliderElement })
    }
}
