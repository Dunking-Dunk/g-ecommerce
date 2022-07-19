export default class Carousel {
    constructor({ buttons, slider }) {
        this.createCarousel(buttons, slider)
    }

    createCarousel(buttons, slider) {
        buttons.forEach((button) => {
            button.addEventListener('click', (e) => {
                const offset = button.dataset.carouselButton === 'next' ? 1 : -1
                const slides = button.closest('[data-carousel]').querySelector('[data-slides]')
                const activeSlide = slides.querySelector('[data-active]')
                let newIndex = [...slides.children].indexOf(activeSlide) + offset
                if (newIndex < 0) newIndex = slides.children.length - 1
                if (newIndex >= slides.children.length) newIndex = 0

                slides.children[newIndex].dataset.active = true
                delete activeSlide.dataset.active

                slider.style.width = `${
                    (newIndex / slides.children.length + 1 / slides.children.length) * 100
                }%`
            })
        })
    }
}
