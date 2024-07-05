
const convert = require('xml-js');
const fs = require('fs');
const request = require('request');
const snoowrap = require('snoowrap');
const {decode} =require('html-entities');
const db = require('better-sqlite3')('./data.db');
function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}
function write_log(val,file='./logger.txt'){
    let dt=new Date()
    val+="\n"+dt.toLocaleString()
    val+="\n================================"
    fs.appendFileSync(file, val+"\n", err => {
  });
}
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
function check_url(db,res,regex,sub, callback) {
    let title=res['title'];
    if(typeof title === "undefined"){
        return callback(res,false); 
    }else if(!check_regex(regex,title)){
        res["log"]+="regex didn't match "  +"\n"
        return callback(res,false);
    }
    res["log"]+="regex matched \n"
    const row = db.prepare(`SELECT * FROM urls WHERE url = (?) AND sub=(?)`).get(res["link"],sub);
    if(typeof row === "undefined"){
        db.exec(`INSERT INTO urls VALUES ('${res["link"]}','${sub}')`)
        res["log"]+="posted : "+res["title"] +"\n"
        return callback(res,true)
      }else{
        res["log"]+="we aleardy posted it \n"    
        return callback(res,false) 
      }
} 
// ===================


function get_data(url,special_urls,time_rang_h,time_rang_m,sub,callback){
    var post = {};
    request(url,function (error, response, body) {
            try{
            var Json = JSON.parse(convert.xml2json(body, {compact: false}));
            }catch(err){
                write_log(err,'./error.txt')
                write_log("coudl't parse " +url ,'./error.txt')
                return callback({},false,sub);
            }
            if (special_urls.indexOf(url)==-1){
                try{
                    elements = Json['elements'][0]['elements'][0]["elements"]
                    }catch(err){
                        write_log(err,'./error.txt')
                        write_log("problem reading data from:" +url,'./error.txt')

                        return callback({},false,sub);
                    }
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
                                    write_log("no new news from :" +url,"./"+sub+".txt");

                                    return callback(post,false,sub);
                                     
                                }
                                    
                                
                            }
                        }
                        post["log"]="detected new data from :" +url +"\n"+"now testing regex:" +url +"\n"
                        pause(10)

                        return  callback(post,true,sub);
                        
                         
                    }
                }
            }else {
                try{
                    elements = Json['elements'][0]['elements']
                    }catch(err){
                        write_log(err,'./error.txt')
                        write_log("problem reading data from:" +url,'./error.txt')
                        return callback({},false,sub);
                    }
                
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
                                    write_log("no new news from :" +url,"./"+sub+".txt");
                                    return callback(post,false,sub);
                                     
                                }
                            }
                        }
                        post["log"]="detected new data from :" +url +"\n"+"now testing regex:" +url +"\n"
                        return callback(post,true,sub);
                    }
                }
            }
    
        });

    
}


async function main (){
    let time = 0;
    /* */
    let file_data = fs.readFileSync('./config.json', { encoding: 'utf8', flag: 'r' });
        let file = JSON.parse(file_data)

        for(data of file.instances){
        let links=data.links;
        let SUB_REDDIT=data.SUB_REDDIT;
        let regex=data.regex;
        let special_links=data.special_links;
        let max_file_size=data.max_file_size;
        let time_rang_m=data.time_rang_m
        let time_rang_h=data.time_rang_h
        let post_time_s=data.post_time_s;
        let post_time_m=data.post_time_m;
       
   
        if(data.flag){
           
        const Bot = new snoowrap({
            userAgent:  data.userAgent ,
            clientId:  data.clientId,
            clientSecret:  data.clientSecret,
            refreshToken:  data.refreshToken
          });

            for(let i = 0;i<links.length;i++){ 
                pause(50)

                if(data.flag ){
                get_data(links[i],special_links,time_rang_h,time_rang_m,SUB_REDDIT, function(res,f,sub){
                    if(f){
                        check_url(db,res,regex,sub,function(res,v){
                        if(v){ 
                            setTimeout(()=>{Bot.getSubreddit(sub).submitLink({title: res['title'], url: res['link']})},(post_time_s+post_time_m*60)*1000*time)
                            time++;    
                        }
                       write_log(res["log"],"./"+sub+".txt")
                       let stats = fs.statSync("./"+sub+".txt")
                       try{
                       let fileSizeInBytes = stats.size;
                       let fileSizeInMegabytes = fileSizeInBytes / (1024*1024);
                       if(fileSizeInMegabytes>=max_file_size){
               
                           fs.writeFile("./"+sub+".txt", "", err => {
                             })
                       }
                        }catch(e){
                   }
                       
  
                   });
               }
               });
           
           }
        }
          }
        
        
    }
    /**/
        setTimeout(main,5*60*1000)

}



module.exports= {   

    main:main,

    }




