const http = require('http')
const { URL } = require('url')
const { bodyParser } = require('./helpers/bodyParser.js')
const routes = require('./routes.js')

const server = http.createServer((req, res) => {
    const parsedUrl = new URL(`http://localhost:3000${req.url}`)
    let { pathname } = parsedUrl

    const splittedEndpoint = pathname.split('/').filter(Boolean)

    let id = null;

    if (splittedEndpoint.length > 1) {
        pathname = `/${splittedEndpoint[0]}/:id`
        id = splittedEndpoint[1]
    }

    const route = routes.find((routeObj) => 
        routeObj.endpoint === pathname && routeObj.method === req.method
    )


    if (route) {
        req.query = Object.fromEntries(parsedUrl.searchParams)
        req.params = { id }

        const send = (statusCode, body) => {
            res.writeHead(statusCode, {
                'Content-Type': 'application/json'
            })
            
            res.end(JSON.stringify(body))
        }

        res.send = send

        const methodsThatNeedsBodyParser = ['POST', 'PUT', 'PATCH']
        if (methodsThatNeedsBodyParser.includes(req.method)) {
            bodyParser(req, () => route.handler(req, res))
        } else {
            route.handler(req, res)
        }


    } else {
        res.writeHead(404, {
            'Content-Type': 'application/json'
        })
        res.end(`Cannot ${req.method} ${pathname}`)
    }

})
const PORT = 3000
server.listen(PORT, () => console.log(`server is running on http://localhost:${PORT}`))