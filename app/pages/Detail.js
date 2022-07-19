import Page from '../classes/Page.js'

export default class Detail extends Page {
    constructor() {
        super({
            element: '.detail',
            elements: {
                wrapper: '.detail-wrapper',
            },
            id: 'detail',
        })
    }
}
