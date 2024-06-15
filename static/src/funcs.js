
const convert = require('xml-js');
const fs = require('fs');
require('dotenv').config()
const request = require('request');
const sqlite3 = require("sqlite3").verbose();
const snoowrap = require('snoowrap');
const {decode} =require('html-entities');
const db = new sqlite3.Database("./data.db",sqlite3.OPEN_READWRITE,(err)=>{
    if(err) return console.error(err.message)
});

  
  

// work good ===================
function check_regex(regexs,text) { 
    if (regexs.length==0){
        
        return true;
    }
    for(let i=0;i<regexs.length;i++){
        let reg=new RegExp(regexs[i],'i')
        if(text.search(reg) != -1){
           
            return true;
        }
    }
   
return false
}

function check_url(db,res,regex, callback) {
    let title=res['title'];
    
    if(typeof title === "undefined"){
console.log("couldn't get text")
            return callback(res,false);
    }else if(!check_regex(regex,title)){
        
        return callback(res,false);
    }
    const data=db.all(`SELECT url FROM urls WHERE url = ? `,[res['link']],(err,row)=>{
        if(err) return console.error(err.message);
            if(row.length>0){
              return callback(res,false)
            }else{
                db.run(`INSERT INTO urls VALUES (?)`,[res['link']],(err)=>{
                if(err) return console.error(err.message);
                return callback(res,true)
                });
    
            }
    });
} 
// ===================


async function get_data(url,special_urls,callback){
    var post = {};
    request(url,function (error, response, body) {
            try{
            var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));
            }catch(err){
                return callback({});
            }
            if (special_urls.indexOf(url)==-1){
                elements = Json['elements'][0]['elements'][0]["elements"]
                for (i in elements){
                    if (elements[i]["name"] == "item" ){
                        element = elements[i]["elements"];
                        for (j in element){
                            if(element[j]["name"] == "link"){
                                post["link"] = element[j]["elements"][0]["text"] ;
                            }else if(element[j]["name"] == "title"){
                            post["title"] = decode(element[j]["elements"][0]["text"] || element[j]["elements"][0]["cdata"]);
                            }
                            if(element[j]["name"] == "pubDate"){
                                let date=new Date(element[j]["elements"][0]["text"])
                                let now=Date.now()

                                if((now -date)/(3600*1000)>2){
 
                                    return callback({});
                                }
                            }
                        }
                
                        return callback(post);
                    }
                }
            }else {
                elements = Json['elements'][0]['elements']
                for (i in elements){
                    if (elements[i]["name"] == "entry" ){
                        element = elements[i]["elements"];
                        for (j in element){
                            if(element[j]["name"] == "link"){
                                post["link"] = element[j]["attributes"]["href"]
                                if(typeof post["title"]  === "undefined"){
                                post["title"] =decode(element[j]["attributes"]["title"] );
                                }
                            }
                            if(element[j]["name"] == "title"){
                                post["title"]=decode(element[j]['elements'][0]['text'])
                            }
                            if(element[j]["name"] == "pubDate"){
                                
                                let date=new Date(element[j]["elements"][0]["text"])
                                let now=Date.now()

                                if((now -date)/(3600*1000)>2){

                                    return callback({});
                                }
                            }
                        }
                        
                        return callback(post);
                    }
                }
            }
    
        });

    
}

async function main (){
    let time = 0;
    
    fs.readFile('config.json', 'utf8', (err, data) => {
         data = JSON.parse(data)
         
        let links=data.links;
        let SUB_REDDIT=data.SUB_REDDIT;
        let regex=data.regex;
        let special_links=data.special_links;
        const Bot = new snoowrap({
            userAgent:  data.userAgent ,
            clientId:  data.clientId,
            clientSecret:  data.clientSecret,
            refreshToken:  data.refreshToken
          });
          if(data.flag){
            for(let i = 0;i<links.length;i++){
                get_data(links[i],special_links,function(res){
                    
                   if (res !={} ){
                   check_url(db,res,regex,function(res,v){
                   
                       if(v){
                           setTimeout(()=>{
                            Bot.getSubreddit(SUB_REDDIT).submitLink({title: res['title'], url: res['link']})
                            ;console.log("posted :"+res['title'])
                        
                        },10000*time)
                           time++;  
                       }
                   });
               }
               });
           
           }
          }
        
      });
   

}



module.exports= {   

    main:main,

    }




