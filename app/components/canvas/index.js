import { Renderer, Camera, Transform } from 'ogl'
import Home from './Home/index.js'

export default class Canvas {
    constructor({ template }) {
        this.template = template

        this.x = {
            start: 0,
            distance: 0,
            end: 0,
        }

        this.y = {
            start: 0,
            distance: 0,
            end: 0,
        }

        this.createRenderer()
        this.createCamera()
        this.createScene()
        this.onResize()
    }

    createRenderer() {
        this.renderer = new Renderer({
            alpha: true,
            antialias: true,
        })
        this.gl = this.renderer.gl
        document.body.appendChild(this.gl.canvas)
    }

    createCamera() {
        this.camera = new Camera(this.gl)
        this.camera.position.z = 5
    }

    createScene() {
        this.scene = new Transform()
    }

    createHome() {
        this.home = new Home({ gl: this.gl, sizes: this.sizes, scene: this.scene })
    }

    destroyHome() {
        if (this.home) {
            this.home.destroy()
        }
    }

    onPreloaded() {
        this.onChange(this.template)
    }

    onChange(template) {
        if (template === 'home') {
            this.createHome()
        } else {
            this.destroyHome()
        }

        this.template = template
    }

    update() {
        if (this.home && this.home.update) {
            this.home.update()
        }
        this.renderer.render({ scene: this.scene, camera: this.camera })
    }

    onResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.perspective({
            aspect: this.gl.canvas.width / this.gl.canvas.height,
        })

        const fov = this.camera.fov * (Math.PI / 180)
        const height = 2 * Math.tan(fov / 2) * this.camera.position.z
        const width = height * this.camera.aspect

        this.sizes = {
            width,
            height,
        }

        if (this.home) {
            this.home.onResize(this.sizes)
        }
    }

    onMouseDown(event) {
        this.isDown = true

        this.x.start = event.touches ? event.touches[0].clientX : event.clientX
        this.y.start = event.touches ? event.touches[0].clientY : event.clientY

        const values = {
            x: this.x,
            y: this.y,
        }

        if (this.home) {
            this.home.onMouseDown(values)
        }
    }

    onMouseMove(event) {
        if (!this.isDown) return

        const x = event.touches ? event.touches[0].clientX : event.clientX
        const y = event.touches ? event.touches[0].clientY : event.clientY

        this.x.end = x
        this.y.end = y

        const values = {
            x: this.x,
            y: this.y,
        }

        if (this.home) {
            this.home.onMouseMove(values)
        }
    }

    onMouseUp(event) {
        this.isDown = false

        const x = event.touches ? event.touches[0].clientX : event.clientX
        const y = event.touches ? event.touches[0].clientY : event.clientY

        this.x.end = x
        this.y.end = y

        const values = {
            x: this.x,
            y: this.y,
        }

        if (this.home) {
            this.home.onMouseUp(values)
        }
    }

    onMouseWheel({ pixelX, pixelY }) {
        if (this.home) {
            this.home.onWheel({ pixelX, pixelY })
        }
    }
}
