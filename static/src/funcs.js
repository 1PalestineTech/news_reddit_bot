
const convert = require('xml-js');
const fs = require('fs');
require('dotenv').config()
const request = require('request');
const sqlite3 = require("sqlite3").verbose();
const snoowrap = require('snoowrap');
const {decode} =require('html-entities');


 function write_log(val){
    fs.appendFileSync('./logger.txt', val+"\n", err => {
    
  });
}

const db = require('better-sqlite3')('./data.db');



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
            callback(res,false);
            return 
    }else if(!check_regex(regex,title)){
        write_log("regex didn't match -------------------" )

         callback(res,false);
         return
    }
      write_log("regex matched  -------------------")

      const row = db.prepare(`SELECT * FROM urls WHERE url = ?`).get(res["link"]);
      if(typeof url === "undefined"){
        db.exec(`INSERT INTO urls VALUES ('${res["link"]}')`)
        write_log("posted : "+res["title"])
        callback(res,true)
        return 
      }else{
        write_log("we aleardy posted it ")

        callback(res,false)
        return 
      }

} 
// ===================


 function get_data(url,special_urls,callback){
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
                                    write_log("no new news from :" +url )
                                     callback({});
                                     return 
                                }else{
                                    write_log("detected new data from :" +url )
                                }
                            }
                        }
                        
                        write_log("now testing regex:" +url )
                        callback(post);
                        return 
                         
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
                                    write_log("no new news from :" +url )
                                    callback({});
                                    return 
                                }
                            }
                        }
                        write_log("detected new data from :" +url )
                        write_log("now testing regex:" +url )
                        callback(post);
                        return 
                    }
                }
            }
    
        });

    
}


function main (){
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
                get_data(links[i],special_links, function(res){
                    
                   if (res !={} ){
                   check_url(db,res,regex,function(res,v){
                   
                       if(v){
                           setTimeout(()=>{
                            Bot.getSubreddit(SUB_REDDIT).submitLink({title: res['title'], url: res['link']})
                        
                        },30000*time)
                           time++;  
                       }
                   });
               }
               });
           
           }
          }
        
      });
   setTimeout(()=>main(),30000)

}



module.exports= {   

    main:main,

    }




