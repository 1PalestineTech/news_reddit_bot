const convert = require('xml-js');
require('dotenv').config()
const request = require('request');
const sqlite3 = require("sqlite3").verbose();
const snoowrap = require('snoowrap');
const {decode} =require('html-entities');
const db = new sqlite3.Database("data.db",sqlite3.OPEN_READWRITE,(err)=>{
    if(err) return console.error(err.message)
});
const Bot = new snoowrap({
    userAgent:  process.env.userAgent ,
    clientId:  process.env.clientId,
    clientSecret:  process.env.clientSecret,
    refreshToken:  process.env.refreshToken
  });
  
  
  

const links = ['http://theconversation.edu.au/articles'      ,
'https://inthesetimes.com/rss'                               ,
'https://bdsmovement.net/rss-feed.xml'                       ,
'https://www.newarab.com/rss'                                ,
'http://www.guardian.co.uk/world/palestinian-territories/rss',
'https://daysofpalestine.ps/feed/'                           ,
'https://www.aljazeera.com/xml/rss/all.xml'                  ,
'https://www.middleeasteye.net/rss'                          ,
'https://www.palestinechronicle.com/feed/'                   ,
'https://electronicintifada.net/rss.xml'                     ,
'https://mondoweiss.net/feed/'                               ,
'https://www.972mag.com/feed'                                ,
'https://daysofpalestine.ps/feed/'                           ,
'https://freehaifa.wordpress.com/feed/'                      ,
'https://richardfalk.org/feed/'                              ,
'https://israelpalestinenews.org/feed'                       ,
'https://palsolidarity.org/feed/'                            ,
'https://www.commondreams.org/feeds/feed.rss'                ,
'https://english.pnn.ps/feed'                                ,
'https://ramzybaroud.net/feed/'                              ,
'https://realmedia.press/feed/'                              ,
'https://samidoun.net/feed/'                                 ,
'https://thegrayzone.com/feed/'                              ,
'https://theintercept.com/feed'                              ,
'https://www.newarab.com/rss'                                ,
'https://english.palinfo.com/feed'                           ,
'https://thecradle.co/feed'                                  ,
'https://zeteo.com/feed'                                     ,
'https://original.antiwar.com/feed/'                         ,
'https://www.juancole.com/feed'                              ,
'https://jacobin.com/feed/'                                  ,
'https://therealnews.com/feed'                               ,
'https://www.readthemaple.com/rss/'                         ];

// work good
function check_url(db,res, callback) {
    let title=res['title'];
    let regex1=/ICC|ICJ|genocide|international Criminal Court|INTERNATIONAL COURT OF JUSTICE|idf|dead sea|Israel Defense Forces|holy land|Ibrahimi Mosque|Cave of the Patriarchs|dome of the rock/i
    let regex2=/jerusalem|quds|alqouds|aqsa|alaqsa|alaqsa|al-masjid al-aqsa|Temple Mount|tel aviv|massacre|west bank|w\.bank|humanity|human right/i
    let regex3=/palestin(e|ian)s|gaza|israel|israel|zionist|aipac|zionism|israeli|Palestinians authority|hamas|fateh|abbas|nakba|jordan river/i
    let regex4=/Acre|Abu Sinan|Amqa|Arab Ghawarina|Arab al-?Na'?im|Arab al-?Samniyya|Arraba -?Buttof|Ayn al-?'?Asad|al-?Bassa|Bayt Jann|Bi'?na|al-Birwa|Buqei''a|Peki'?in |al(\s|-)?Damun/i
    let regex5=/Dayr al-Asad|Dayr Hanna|Dayr al-Qasi|Fassuta|al(\s|-)?Ghabisiyya|al(\s|-)?Husseiniya|Iqrit|Iribbin|Khirbat|al(\s|-)?Jadeida|Jatt|Jiddin|Khirbat|Julis|al-Kabri|Kabul |Kafr '?Inan|Kafr Sumei|Kafr Yasif|Kammana East|Kammana West|Kh\.? Idmith/i 
    let regex6=/Kh\.? Jurdeih|Kh\.? al(\s|-)?Suwwana|Kisra(\s|-)?Sumei|Kuwaykat|Majd al(\s|-)?Kurum|Makr|al(\s|-)?Manshiyya|al(\s|-)?Mansura|Mas'?ub|al-Mazra'?a|Mi'?ar|Mi'?ilya|al(\s|-)?Nabi Rubin|Nahf|al(\s|-)?Nahr|Nawaqir|al(\s|-)?Qubsi|al(\s|-)?Rama/i

    if(title.search(regex1)==-1 &&title.search(regex2)==-1 && title.search(regex3)==-1 && title.search(regex4)==-1 && title.search(regex5)==-1  && title.search(regex6)==-1 ){
    return callback(res,false)
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
// work good
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
    if (url != 'https://jacobin.com/feed/' && url != 'http://theconversation.edu.au/articles'){
        console.log(url)
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
    }else {
        elements = Json['elements'][0]['elements']
        for (i in elements){
            if (elements[i]["name"] == "entry" ){
                element = elements[i]["elements"];
                for (j in element){
                    if(element[j]["name"] == "link"){
                        post["link"] = element[j]["attributes"]["href"]
                        post["title"] =decode(element[j]["attributes"]["title"] ||element[4]['elements'][0]['text']);
                     
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
            Bot.getSubreddit(process.env.SUB_REDDIT).submitLink({title: res['title'], url: res['link']});
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
