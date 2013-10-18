var express = require('express')
var app     = express()

var Shred = require("shred")
var shred = new Shred()

// serve static files
app.use(express.static('public'))

function return_error (res) {
  res.statusCode = 500
  res.send({ error: "no way jose" })
}

app.get("/next_video.json", function (req, res) {
  console.log("humbling proxxxy")
  var server_res = res
  server_res.setHeader("content-type", "application/json")
  var req = shred.get({
    url: "http://breedtv.com/random",
    on: {
      success: function (res) {
        server_res.send(JSON.parse(res.content.data))
      },
      error: function (res) {
        return_error(server_res)
        console.log("hellof error")
        console.log(res)
      },
      timeout: function (res) {
        return_error(server_res)
        console.log("times out of here!")
        console.log(res)
      }
    }
  })
})

var port = 3000 || process.env.PORT
app.listen(port)
console.log("i'm in the machine on phongle number " + port)
