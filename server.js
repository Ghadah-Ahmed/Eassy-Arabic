let express = require('express')
let mongodb = require('mongodb')
let sanitizeHTML = require('sanitize-html')
let rateLimit = require("express-rate-limit");


let app = express()
let db

let port = process.env.PORT
if (port == null || port == "") {
  port = 3000
}


app.use(express.static('public'))
app.set('view engine', 'ejs');


let connectionString = 'mongodb+srv://todoAppUser:GhadahAhmed@cluster0.84wru.mongodb.net/comments?retryWrites=true&w=majority'
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  db = client.db()
  app.listen(port)
})

const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // Start blocking after 5 requests
  message: "Too many comments created from this IP, please try again after an hour"
});

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// function passwordProtected(req, res, next) {
//   res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"')
//   console.log(req.headers.authorization)
//   if (req.headers.authorization == "Basic bGVhcm46amF2YXNjcmlwdA==") {
//     next()
//   } else {
//     res.status(401).send("Authentication required")
//   }
// }

// app.use(passwordProtected)

app.get('/', function(req, res) {

  db.collection('ArabicGrammer').find().sort({_id:-1}).toArray(function(err, items) {
    res.render("index", {item: JSON.stringify(items) })
  })
})

app.post('/create-item', createAccountLimiter, function(req, res) {
  let safeText = sanitizeHTML(req.body.text, {allowedTags: [], allowedAttributes: {}}).slice(0,20)
  let safeText2 = sanitizeHTML(req.body.name, {allowedTags: [], allowedAttributes: {}}).slice(0,280)
  var d = new Date();
  var months = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
  var sign = ( d.getHours() <= 11) ? "ص" : "م";
  var day = ( d.getHours() + 1 <= 12) ? d.getHours() : d.getHours() - 12
  var date =  d.getDate()  + "-" +  months[d.getMonth()] + "-" + d.getFullYear() + " " + day + ":" + d.getMinutes() + " " + sign

  if (safeText.charAt(0) == " "){
    console.log("invalid input")

  }else if( safeText2.charAt(0) == " "){
    console.log("invalid input")

  }else{
  db.collection('ArabicGrammer').insertOne({text: safeText, name: safeText2, date: date}, function(err, info) {
    res.json(info.ops[0])
  })
}
})



