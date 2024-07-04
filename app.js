const path = require("path");
const cookieParser = require('cookie-parser');
const {main} = require("./src/funcs.js");
const express = require("express");
const bodyParser = require("body-parser");
const fs=require("fs");
const app=express()

const request = require('request');
app.use(cookieParser());
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");
var staticPath = path.join(__dirname, "static");
app.use(express.static(staticPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", function(req, res) {
  let d = fs.readFileSync('./config.json', { encoding: 'utf8', flag: 'r' });
  d = JSON.parse(d)
  let subs=[];
  for (let sub of d.instances ){
    subs.push(SUB_REDDIT);
  }
  
    res.render("logger.ejs",{subs:subs});
  })
  app.post('/setcookie', function (req, res) {

    res.cookie('file', req.body.filename);
    res.redirect("/");
})
  app.get("/get_log", function(req, res) {
    fs.readFile('./'+req.cookies.file +'.txt', 'utf8', (err, data) => {
     
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
    let data = fs.readFileSync('./config.json', { encoding: 'utf8', flag: 'r' });
      data = JSON.parse(d);
        
          if (req.body.bot_data=="start"){
            for (e of data.instances){
              if(e.SUB_REDDIT==req.cookies.file){
                e.flag=true;
                let output=JSON.stringify(data).replaceAll(',',',\n');
                fs.writeFile('./config.json', output, err => {
                  if (err) {
                    console.error(err);
                  } else {
                    fs.appendFile('./'+req.cookies.file +'.txt', "================ bot started    ============="+"\n", err => {
                      res.redirect("/");
                    });
                  }
                });
                
                
              }
            }
              
          
  
          }else{
            for (e of data.instances){
              if(e.SUB_REDDIT==req.cookies.file){
                e.flag==false;
                let output=JSON.stringify(data).replaceAll(',',',\n');
                fs.writeFile('./config.json', output, err => {
                  if (err) {
                    console.error(err);
                  } else {
                    fs.appendFile('./'+req.cookies.file +'.txt', "================ bot stopped    ============="+"\n", err => {
                      res.redirect("/");
                    });
                  }
                });
               
                
              }
            }
          }

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

  fs.writeFile('./'+req.cookies.file +'.txt', "", err => {
    res.redirect("/");
  })
  
})

console.log("Bot started ============================")

app.listen(3000, function() {
    console.log("App started on port 5000");
  });
  main()