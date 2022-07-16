import Home from './pages/Home.js'
import Collections from './pages/collections.js'
import Preloader from './components/Preloader.js'
import Navigation from './components/Navigation.js'
import Canvas from './components/canvas/index.js'
import NormalizeWheel from 'normalize-wheel'

import each from 'lodash/each.js'

class App {
    constructor() {
        this.createContent()

        this.createCanvas()
        this.createPreloader()
        this.createNavigation()
        this.createPage()

        this.addEventListeners()
        this.addLinkListners()

        this.update()
    }

    createContent() {
        this.content = document.querySelector('.content')
        this.template = this.content.getAttribute('data-template')
    }

    createCanvas() {
        this.canvas = new Canvas({ template: this.template })
    }

    createPreloader() {
        this.preloader = new Preloader()
        this.preloader.once('completed', this.onPreloaded.bind(this))
    }

    createNavigation() {
        this.navigation = new Navigation({ template: this.template })
    }

    onPreloaded() {
        this.onResize()
        this.canvas.onPreloaded()
    }

    createPage() {
        this.pages = {
            home: new Home(),
            collections: new Collections(),
        }
        this.page = this.pages[this.template]
        this.page.create()
        this.page.show()
    }

    //events
    addEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this))
        window.addEventListener('mousewheel', this.onMouseWheel.bind(this))

        window.addEventListener('mousedown', this.onMouseDown.bind(this))
        window.addEventListener('mousemove', this.onMouseMove.bind(this))
        window.addEventListener('mouseup', this.onMouseUp.bind(this))

        window.addEventListener('touchdown', this.onMouseDown.bind(this))
        window.addEventListener('touchmove', this.onMouseMove.bind(this))
        window.addEventListener('touchup', this.onMouseUp.bind(this))
    }

    onResize(event) {
        if (this.canvas && this.canvas.onResize) {
            this.canvas.onResize()
        }
    }

    onMouseWheel(event) {
        const scrollWheel = NormalizeWheel(event)
        const { pixelX, pixelY } = scrollWheel
        if (this.canvas && this.canvas.onMouseWheel) {
            this.canvas.onMouseWheel({ pixelX, pixelY })
        }
    }

    onMouseDown(event) {
        if (this.canvas && this.canvas.onMouseDown) {
            this.canvas.onMouseDown(event)
        }
    }

    onMouseMove(event) {
        if (this.canvas && this.canvas.onMouseWheel) {
            this.canvas.onMouseMove(event)
        }
    }

    onMouseUp(event) {
        if (this.canvas && this.canvas.onMouseUp) {
            this.canvas.onMouseUp(event)
        }
    }

    addLinkListners() {
        const links = document.querySelectorAll('a')
        each(links, (e) => {
            e.onclick = (event) => {
                const { href } = e
                console.log(href)
                event.preventDefault()
                this.onChange(href)
            }
        })
    }

    async onChange(url) {
        try {
            this.page.hide()
            if (this.canvas && this.canvas.destroyHome) this.canvas.destroyHome()
            const request = await window.fetch(url)
            window.history.pushState({}, '', url)
            if (request.status === 200) {
                const html = await request.text()

                const div = document.createElement('div')
                div.innerHTML = html

                const divContent = div.querySelector('.content')
                this.template = divContent.getAttribute('data-template')

                this.content.setAttribute('data-template', this.template)
                this.content.innerHTML = divContent.innerHTML

                this.canvas.onChange(this.template)
                this.navigation.onChange(this.template)

                this.page = this.pages[this.template]
                this.page.create()

                this.page.show()
                this.addLinkListners()
            }
        } catch (error) {
            console.log(error)
        }
    }

    //animation
    update() {
        if (this.canvas && this.canvas.update) {
            this.canvas.update()
        }

        this.frame = window.requestAnimationFrame(() => this.update())
    }
}
new App()
