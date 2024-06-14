const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app=express()
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
var staticPath = path.join(__dirname, "static");
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function(req, res) {
    res.render("footer.ejs");
  })




app.listen(3000, function() {
    console.log("App started on port 3000");
  });

