import { Transform, Plane } from 'ogl'
import map from 'lodash/map.js'
import each from 'lodash/each.js'
import Media from './Media.js'
import GSAP from 'gsap'

export default class {
    constructor({ gl, sizes, scene }) {
        this.gl = gl
        this.sizes = sizes
        this.scene = scene
        this.group = new Transform()

        this.galleryElement = document.querySelector('.home__images')
        this.mediasElement = document.querySelectorAll('.home__images__media__image')

        this.group.setParent(this.scene)
        this.createGeometry()
        this.createGallery()

        this.onResize(this.sizes)

        this.x = {
            current: 0,
            target: 0,
            direction: '',
            lerp: 0.1,
        }

        this.y = {
            current: 0,
            target: 0,
            lerp: 0.1,
            direction: '',
        }
        this.scrollCurrent = {
            x: 0,
            y: 0,
        }

        this.scroll = {
            x: 0,
            y: 0,
        }
    }

    createGeometry() {
        this.geometry = new Plane(this.gl)
    }

    createGallery() {
        this.medias = map(
            this.mediasElement,
            (image, index) =>
                new Media({
                    gl: this.gl,
                    sizes: this.sizes,
                    index,
                    scene: this.group,
                    geometry: this.geometry,
                    element: image,
                })
        )
    }

    onMouseDown({ x, y }) {
        this.scrollCurrent.x = this.scroll.x
        this.scrollCurrent.y = this.scroll.y
    }

    onMouseMove({ x, y }) {
        const Xdistance = x.start - x.end
        const Ydistance = y.start - y.end

        this.x.target = this.scrollCurrent.x - Xdistance
        this.y.target = this.scrollCurrent.y - Ydistance
    }

    onMouseUp(event) {}

    onWheel(event) {
        const { pixelX, pixelY } = event
        this.x.target += pixelX
        this.y.target += pixelY
    }

    update() {
        if (!this.galleryBounds) return

        this.x.current = GSAP.utils.interpolate(this.x.current, this.x.target, this.x.lerp)
        this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp)

        if (this.scroll.y < this.y.current) {
            this.y.direction = 'top'
        } else if (this.scroll.y > this.y.current) {
            this.y.direction = 'bottom'
        }

        this.scroll.y = this.y.current

        map(this.medias, (media) => {
            const scaleY = media.mesh.scale.y / 2
            const offsetY = this.sizes.height

            if (this.y.direction === 'top') {
                const y = media.mesh.position.y - scaleY

                if (y < -offsetY) {
                    media.extra.y += this.gallerySizes.height

                    // media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.05, Math.PI * 0.05)
                }
            } else if (this.y.direction === 'bottom') {
                const y = media.mesh.position.y - scaleY

                if (y > offsetY) {
                    media.extra.y -= this.gallerySizes.height

                    // media.mesh.rotation.z = GSAP.utils.random(-Math.PI * 0.05, Math.PI * 0.05)
                }
            }
            media.update(this.scroll)
        })
        this.y.target += 1
    }

    onResize(sizes) {
        this.galleryBounds = this.galleryElement.getBoundingClientRect()
        this.sizes = sizes

        this.gallerySizes = {
            height: this.galleryBounds.height / window.innerHeight + this.sizes.height + 2,
            width: this.galleryBounds.width / window.innerWidth + this.sizes.width,
        }

        each(this.medias, (media) => media.onResize(sizes))
    }

    destroy() {
        this.scene.removeChild(this.group)
    }
}
