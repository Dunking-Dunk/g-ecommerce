import 'dotenv/config'
import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import * as prismic from '@prismicio/client'
import * as prismicH from '@prismicio/helpers'
import fetch from 'node-fetch'
import methodOverride from 'method-override'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT
const app = express()

const endpoint = prismic.getEndpoint(process.env.PRISMIC_REPO_NAME)
const accessToken = process.env.PRISMIC_ACCESS_TOKEN
const client = prismic.createClient(endpoint, {
    fetch,
    accessToken,
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride())
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    res.locals.ctx = {
        prismicH,
    }
    res.locals.Numbers = (index) => {
        return index == 0 ? 'One' : index == 1 ? 'Two' : index == 2 ? 'Three' : index == 3 && 'Four'
    }
    next()
})

app.get('*', async (req, res, next) => {
    const preloader = await client.getSingle('preloader')
    const navigation = await client.getSingle('navigation')
    res.locals.preloader = preloader.data
    res.locals.navigation = navigation.data

    next()
})

app.get('/', async (req, res) => {
    const document = await client.getSingle('home')
    res.render('pages/home', { home: document.data })
})

app.get('/collections', async (req, res) => {
    const { query } = req
    if (!query.collections) {
        query.collections = 'all'
    }
    const graphQuery = `{
                collection {
                    title
                    products
                    }
            }`
    const collections = await client.getSingle('collections')
    console.log(collections.data.collections)
    const collection = await client.getByUID('collection', query.collections, { graphQuery })
    const products = await collection.data.products
    const products_uid = products.map((data) => data.product.uid)
    const products_data = []
    for (let i = 0; i < products_uid.length; i++) {
        const product = await client.getByUID('product', products_uid[i])
        products_data.push(product)
    }
    res.render('pages/collections', {
        collections: collections.data,
        products: products_data,
        collection,
    })
})

app.get('/detail/:id', async (req, res) => {
    const { id } = req.params
    console.log(id)
    const product = await client.getByID(id)
    res.render('pages/detail', { product: product.data })
})

app.listen(PORT || 3000, () => {
    console.log('listening on port ' + PORT || 3000)
})
