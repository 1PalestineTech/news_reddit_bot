const convert = require('xml-js');
const request = require('request');
const sqlite3 = require("sqlite3").verbose();
const snoowrap = require('snoowrap');
const db = new sqlite3.Database("data.db",sqlite3.OPEN_READWRITE,(err)=>{
    if(err) return console.error(err.message)
});
const Bot = new snoowrap({
    userAgent: '',
    clientId: '',
    clientSecret: '',
    refreshToken: ''
  });
  
  
  

const links = ['https://www.aljazeera.com/xml/rss/all.xml'   ,
'https://www.middleeasteye.net/rss'                     ,
'https://www.palestinechronicle.com/feed/'              ,
'https://electronicintifada.net/rss.xml'                ,
'https://mondoweiss.net/feed/'                          ,
'https://www.972mag.com/feed'                           ,
'https://daysofpalestine.ps/feed/'                      ,
'https://freehaifa.wordpress.com/feed/'                 ,
'https://richardfalk.org/feed/'                         ,
'https://israelpalestinenews.org/feed'                  ,
'https://palsolidarity.org/feed/'                       ,
'https://www.commondreams.org/feeds/feed.rss'           ,
'https://jfjfp.com/feed/'                               ,
'https://english.pnn.ps/feed'                           ,
'https://ramzybaroud.net/feed/'                         ,
'https://realmedia.press/feed/'                         ,
'https://samidoun.net/feed/'                            ,
'https://thegrayzone.com/feed/'                         ,
'https://theintercept.com/feed'                         ,
'https://www.newarab.com/rss'                           ,
'https://english.palinfo.com/feed'                      ,
'https://thecradle.co/feed'                             ,
'https://zeteo.com/feed'                                ,
'https://original.antiwar.com/feed/'                    ,
'https://www.juancole.com/feed'                         ,
'https://jacobin.com/feed/'                             ,
'https://therealnews.com/feed'                          ,
'https://www.readthemaple.com/rss/'                 ];

function check_url(db,res, callback) {
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
function remove_item(array,index){
    let arr = [];
    for (let i = 0 ;i < array.length ;i++){
        if(i != index){
            arr.push(array[i]);
        }
    }
    return arr;
}


function get_data(url,callback){
    var post = {"link":'',"title":''};
    request(url,function (error, response, body) {
    console.error('error:', error); 
    var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));
    if (url != 'https://jacobin.com/feed/'){
        elements = Json['elements'][0]['elements'][0]["elements"]
        for (i in elements){
            if (elements[i]["name"] == "item" ){
                element = elements[i]["elements"];
                for (j in element){
                    if(element[j]["name"] == "link"){
                        post["link"] = element[j]["elements"][0]["text"] ;
                    }else if(element[j]["name"] == "title"){
                        post["title"] = element[j]["elements"][0]["text"] || element[j]["elements"][0]["cdata"];
                    }
                };
                
                return callback(post);
            }
        }
    }else{
        elements = Json['elements'][0]['elements']
        for (i in elements){
            if (elements[i]["name"] == "entry" ){
                element = elements[i]["elements"];
                for (j in element){
                    if(element[j]["name"] == "link"){
                        post["link"] = element[j]["attributes"]["href"] ;
                        post["title"] = element[j]["attributes"]["title"] ;
                     
                    }; 
                }
                return callback(post);
            }
        }
    }
    
  });
}

function main (links){
    if (links.length==0){
        return
    }
let index =Math.floor(Math.random() * links.length);
let url= links[index]

links=remove_item(links,index)
    get_data(url ,function(res){
    check_url(db,res,function(res,v){
        if(v){
            Bot.getSubreddit('reddit_sub').submitLink({title: res['title'], url: res['link']});
            console.log("posted")
        }
        else{
            console.log("not posted")
            
            main(links);
            
        }
    });
});
}



module.exports= {   

    main:main,
    links:links 
    }
