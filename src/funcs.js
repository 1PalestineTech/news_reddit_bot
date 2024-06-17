
const convert = require('xml-js');
const fs = require('fs');
const request = require('request');
const snoowrap = require('snoowrap');
const {decode} =require('html-entities');
function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}

 function write_log(val){

    val+="\n================================"
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
        return callback(res,false);
             
    }else if(!check_regex(regex,title)){
        res["log"]+="regex didn't match "  +"\n"

        return callback(res,false);

    }
      res["log"]+="regex matched \n"
  

      const row = db.prepare(`SELECT * FROM urls WHERE url = (?)`).get(res["link"]);

      if(typeof row === "undefined"){
        db.exec(`INSERT INTO urls VALUES ('${res["link"]}')`)
        res["log"]+="posted : "+res["title"] +"\n"
        return callback(res,true)
      }else{
        res["log"]+="we aleardy posted it \n"
        
        return callback(res,false)
         
      }

} 
// ===================


 function get_data(url,special_urls,time_rang_h,time_rang_m,callback){
    var post = {};
    request(url,function (error, response, body) {
            try{
            var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));
            }catch(err){
                return callback({},false);
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

                                if((now -date)/1000>(time_rang_h*60+time_rang_m)*60){
                                    write_log("no new news from :" +url);

                                    return callback(post,false);
                                     
                                }
                                    
                                
                            }
                        }
                        post["log"]="detected new data from :" +url +"\n"+"now testing regex:" +url +"\n"
                        pause(10)

                        return  callback(post,true);
                        
                         
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
                                post["title"] = decode(element[j]["attributes"]["title"] );
                                }
                            }
                            if(element[j]["name"] == "title"){
                                post["title"]=decode(element[j]['elements'][0]['text'])
                            }
                            if(element[j]["name"] == "pubDate"){
                                
                                let date=new Date(element[j]["elements"][0]["text"])
                                let now=Date.now()
                                if((now -date)/1000>(time_rang_h*60+time_rang_m)*60){
                                    write_log("no new news from :" +url);
                                    return callback(post,false);
                                     
                                }
                            }
                        }
                        post["log"]="detected new data from :" +url +"\n"+"now testing regex:" +url +"\n"
                        return callback(post,true);
                    }
                }
            }
    
        });

    
}


async function main (){
    let time = 0;
    let data = fs.readFileSync('./config.json', { encoding: 'utf8', flag: 'r' });
        data = JSON.parse(data)
        let links=data.links;
        let SUB_REDDIT=data.SUB_REDDIT;
        let regex=data.regex;
        let special_links=data.special_links;
        let max_file_size=data.max_file_size;
        let time_rang_m=data.time_rang_m
        let time_rang_h=data.time_rang_h
        let post_time_s=data.post_time_s;
        let post_time_m=data.post_time_m;

        var stats = fs.statSync("./logger.txt")
        var fileSizeInBytes = stats.size;
        fileSizeInMegabytes = fileSizeInBytes / (1024*1024);
        if(fileSizeInMegabytes>=max_file_size){
            fs.writeFile('./logger.txt', "", err => {
              })
        }
        if(data.flag){
        const Bot = new snoowrap({
            userAgent:  data.userAgent ,
            clientId:  data.clientId,
            clientSecret:  data.clientSecret,
            refreshToken:  data.refreshToken
          });

            for(let i = 0;i<links.length;i++){ 
                pause(50)
                let data = fs.readFileSync('./config.json', { encoding: 'utf8', flag: 'r' });
                data = JSON.parse(data)
                if(data.flag){
                get_data(links[i],special_links,time_rang_h,time_rang_m, function(res,f){
                    if(f){
                       
                   check_url(db,res,regex,function(res,v){
                   
                       if(v){
                           
                        setTimeout(()=>{Bot.getSubreddit(SUB_REDDIT).submitLink({title: res['title'], url: res['link']})},(post_time_s+post_time_m*60)*1000*time)
                    
                        time++;    
                       }
                       write_log(res["log"])
  
                   });
               }
               });
           
           }
          }
        
        }
        setTimeout(main,10*1000)

}



module.exports= {   

    main:main,

    }




