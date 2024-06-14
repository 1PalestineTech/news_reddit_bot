var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));







app.listen(3000, function() {
    console.log("App started on port 3000");
  });

