const path = require("path");
const {main} = require("./src/funcs.js");
const express = require("express");
const bodyParser = require("body-parser");
const fs=require("fs");
const app=express()

const request = require('request');
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
var staticPath = path.join(__dirname, "static");
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", function(req, res) {

    res.render("logger.ejs");
  })
  app.get("/get_log", function(req, res) {
    fs.readFile('./logger.txt', 'utf8', (err, data) => {
     
      res.send(data.split("\n").reverse().join("\n"));
    });

  })

app.get("/config", function(req, res) {
  fs.readFile('./config.json', 'utf8', (err, data) => {
    res.render("config.ejs",{data:data});
  });
    
  })
  app.post("/config", function(req, res) {
    
fs.writeFile('./config.json', req.body.conf, err => {
  if (err) {
    console.error(err);
  } else {
    res.redirect("config");
  }

  });
})
  app.get("/get_data", function(req, res) {
    fs.readFile('./config.json', 'utf8', (err, data) => {
      res.send(data)
    });
  })



  app.post("/set_bot", function(req, res) {
    
        fs.readFile('./config.json', 'utf8', (err, data) => {
          if (req.body.bot_data=="start"){
            fs.writeFile('./config.json', data.replace('"flag":false','"flag":true'), err => {

              fs.appendFile('./logger.txt', "================ bot started    ============="+"\n", err => {
    
              });
              res.redirect("/");
          
    });
          }else{
            fs.writeFile('./config.json', data.replace('"flag":true','"flag":false'), err => {
              fs.appendFile('./logger.txt', "================ bot stopped    ============="+"\n", err => {
    
              });
              res.redirect("/");
          
    });
          }

  })
})
app.get("/test", function(req, res) {
  res.render("test.ejs",{data:""})
})
app.post("/test", function(req, res) {
  request(req.body.link,function (error, response, body) {
    res.render("test.ejs",{data:body})
  })
  
})
app.post("/clear_log", function(req, res) {
  fs.writeFile('./logger.txt', "", err => {
    res.redirect("/");
  })
  
})

console.log("Bot started ============================")

app.listen(5002, function() {
    console.log("App started on port 3000");
  });
  main()