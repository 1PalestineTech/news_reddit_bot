
const convert = require('xml-js');
const request = require('request');


/*
  request('https://www.aljazeera.com/xml/rss/all.xml', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));
    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"]);
            console.log(elements[i]["elements"][1])//title
            console.log(elements[i]["elements"][0])//link
        }
    }
  });
  
  request('https://www.middleeasteye.net/rss', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));
    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  

  request('https://www.palestinechronicle.com/feed/', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  request('https://electronicintifada.net/rss.xml', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  request('https://mondoweiss.net/feed/', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  request('https://www.972mag.com/feed ', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });

request('https://daysofpalestine.ps/feed/', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });




request('https://freehaifa.wordpress.com/feed/', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  request('https://richardfalk.org/feed/', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  request('https://israelpalestinenews.org/feed', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  

  request('https://palsolidarity.org/feed/', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  request('https://www.commondreams.org/feeds/feed.rss', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  request(' https://jfjfp.com/feed/', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
 
  request('https://english.pnn.ps/feed', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  request(' https://ramzybaroud.net/feed/', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
 
  request('  https://realmedia.press/feed/ ', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });

request('https://samidoun.net/feed/', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });

request('https://thegrayzone.com/feed/', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  request('https://theintercept.com/feed', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
 ********************** need edit
  request('https://www.newarab.com/rss', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  request('https://english.palinfo.com/feed', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  request('https://thecradle.co/feed', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  request('https://zeteo.com/feed', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][2])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  
  request('https://original.antiwar.com/feed/', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
 
  request('https://www.juancole.com/feed', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  request('https://therealnews.com/feed', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]
    for (i in Json['elements'][0]['elements'][0]["elements"]){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][1])//link 
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  
  
  request('https://jacobin.com/feed/', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
   
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements']
    for (i in elements){
        if (elements[i]["name"]=="entry" ){
            console.log(elements[i]["elements"][1])//title
            console.log(elements[i]["elements"][0])//link
        }
    }
  });
  
  */
  request('https://www.readthemaple.com/rss/', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
   
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));

    elements=Json['elements'][0]['elements'][0]["elements"]

    for (i in elements){
        if (elements[i]["name"]=="item" ){
            console.log(elements[i]["elements"][2])//link
            console.log(elements[i]["elements"][0])//title
        }
    }
  });
  