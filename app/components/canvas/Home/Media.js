import { Texture, Program, Mesh } from 'ogl'
import vertex from '../../../shaders/plane-vertex.glsl'
import fragment from '../../../shaders/plane-fragment.glsl'

export default class Media {
    constructor({ gl, geometry, sizes, scene, index, element }) {
        this.gl = gl
        this.geometry = geometry
        this.sizes = sizes
        this.scene = scene
        this.index = index
        this.element = element
        this.createTexture()
        this.createProgram()
        this.createMesh()

        this.extra = {
            x: 0,
            y: 0,
        }
    }

    createTexture() {
        this.texture = new Texture(this.gl, {
            generateMipmaps: false,
        })
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = this.element.getAttribute('data-src')
        img.onload = () => {
            this.texture.image = img
        }
    }

    createProgram() {
        this.program = new Program(this.gl, {
            vertex,
            fragment,
            uniforms: {
                tMap: { value: this.texture },
            },
        })
    }

    createMesh() {
        this.mesh = new Mesh(this.gl, { geometry: this.geometry, program: this.program })
        this.mesh.position.x = 1
        this.mesh.setParent(this.scene)
    }

    createBound(sizes) {
        this.sizes = sizes
        this.mediaBounds = this.element.getBoundingClientRect()
        this.updateScale()
        this.updateX()
        this.updateY()
    }

    updateScale() {
        this.width = this.mediaBounds.width / window.innerWidth
        this.height = this.mediaBounds.height / window.innerHeight

        this.mesh.scale.x = this.width * this.sizes.width
        this.mesh.scale.y = this.height * this.sizes.height
    }

    updateX(x = 0) {
        this.x = (this.mediaBounds.left + x) / window.innerWidth
        this.mesh.position.x =
            -this.sizes.width / 2 + this.mesh.scale.x / 2 + this.x * this.sizes.width + this.extra.x
    }

    updateY(y = 0) {
        this.y = (this.mediaBounds.top + y) / window.innerHeight

        this.mesh.position.y =
            this.sizes.height / 2 -
            this.mesh.scale.y / 2 -
            this.y * this.sizes.height +
            this.extra.y
    }

    onResize(sizes) {
        this.createBound(sizes)
    }

    update(scroll) {
        if (!this.mediaBounds) return
        this.updateX(scroll && scroll.x)
        this.updateY(scroll && scroll.y)
    }
}
