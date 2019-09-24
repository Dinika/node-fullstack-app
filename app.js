const http = require('http')
const requestLister = require('./routes')

const server = http.createServer(requestLister)
server.listen(4000)