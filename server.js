var express = require('express')
var app     = express()

var Shred = require("shred")
var shred = new Shred()

// serve static files
app.use(express.static('public'))

// app.get("/", function (req, res) {
//   console.log("incoming booger")
//   res.send("sup")
// })

app.get("/next_video.json", function (req, res) {
  console.log("humbling proxxxy")
  var server_res = res
  server_res.setHeader("content-type", "application/json")
  var req = shred.get({
    url: "http://breedtv.gopperman.com/random",
    on: {
      success: function (res) {
        server_res.send(JSON.parse(res.content.data))
      },
      error: function (res) {
        server_res.statusCode = 500
        server_res.send({ error: "no way jose" })
        console.log("hellof error")
        console.log(res)
      }
    }
  })
})

app.listen(3000);
console.log("i'm in the machine");
