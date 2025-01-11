function bodyParser(request, callbackFn) {
    let body = ''

    request.on('data', (chunk) => {
        body += chunk
    })

    request.on('end', () => {
        body = JSON.parse(body)
        request.body = body
        callbackFn()
    })
}

module.exports = {
    bodyParser
}