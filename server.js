const express = require('express')
const path = require('path')
const port = process.env.PORT || 8080
const app = express()

// serve static assets normally
app.use(express.static(__dirname + '/src/public'))

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, 'src/index.html'))
})

app.listen(port)
console.log('server started on port ' + port)
