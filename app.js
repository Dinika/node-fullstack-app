const http = require('http')
const fs = require('fs')

function requestLister(req, res) {
  if (req.url === '/') {
    res.write('<html>')
    res.write('<head><title>First server</title></head>')
    res.write('<body>')
    res.write('<form action="/swings" method="POST"><input type="text" name="swings" /><button type="submit">Submit</button></form>')
    res.write('</body>')
    res.write('</html>')
    res.end()
    return
  }
  if (req.url === '/swings' && req.method === 'POST') {
    fs.writeFileSync('swings.txt', 'Marry go round')
    res.statusCode = 302
    res.setHeader('Location', '/')
    res.end()
    return
  }
  res.write('<html>')
  res.write('<head><title>First server</title></head>')
  res.write('<body>')
  res.write('<h1>Childhood</h1>')
  res.write('</body>')
  res.write('</html>')
  res.end()
}

const server = http.createServer(requestLister)
server.listen(4000)