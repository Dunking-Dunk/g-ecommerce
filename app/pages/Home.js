import Page from '../classes/Page.js'

export default class Home extends Page {
    constructor() {
        super({
            element: '.home',
            elements: {
                wrapper: '.home__wrapper',
                link: '.home__link',
            },
            id: 'home',
        })
    }

    create() {
        super.create()
    }
}
