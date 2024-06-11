const convert = require('xml-js');
require('dotenv').config()
const request = require('request');
const sqlite3 = require("sqlite3").verbose();
const snoowrap = require('snoowrap');
const {decode} =require('html-entities');
const db = new sqlite3.Database("./data.db",sqlite3.OPEN_READWRITE,(err)=>{
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

// work good ===================
function check_regex(regexs,text) { 
      
    for(let i=0;i<regexs.length;i++){
        if(text.search(regexs[i]) != -1){
            return true;
        }
    }
return false
}

function check_url(db,res, callback) {
    let title=res['title'];
    // regex ============================
    let regex=[];
        regex[0]=/ICC|ICJ|genocide|international Criminal Court|INTERNATIONAL COURT OF JUSTICE|idf|dead sea|Israel Defense Forces|holy land|Ibrahimi Mosque|Cave of the Patriarchs|dome of the rock/i
        regex[1]=/jerusalem|quds|alqouds|aqsa|alaqsa|alaqsa|al-masjid al-aqsa|Temple Mount|tel aviv|massacre|west bank|w\.bank|humanity|human right/i
        regex[2]=/palestin(e|ian)s|gaza|israel|israel|zionist|aipac|zionism|israeli|Palestinians authority|hamas|fateh|abbas|nakba|jordan river/i
        regex[3]=/Acre|Abu Sinan|Amqa|Arab Ghawarina|Arab al-?Na'?im|Arab al-?Samniyya|Arraba -?Buttof|Ayn al-?'?Asad|al-?Bassa|Bayt Jann|Bi'?na|al-Birwa|Buqei''a|Peki'?in |al(\s|-)?Damun/i
        regex[4]=/Dayr al-Asad|Dayr Hanna|Dayr al-Qasi|Fassuta|al(\s|-)?Ghabisiyya|al(\s|-)?Husseiniya|Iqrit|Iribbin|Khirbat|al(\s|-)?Jadeida|Jatt|Jiddin|Khirbat|Julis|al-Kabri|Kabul |Kafr '?Inan|Kafr Sumei|Kafr Yasif|Kammana East|Kammana West|Kh\.? Idmith/i 
        regex[5]=/Kh\.? Jurdeih|Kh\.? al(\s|-)?Suwwana|Kisra(\s|-)?Sumei|Kuwaykat|Majd al(\s|-)?Kurum|Makr|al(\s|-)?Manshiyya|al(\s|-)?Mansura|Mas'?ub|al-Mazra'?a|Mi'?ar|Mi'?ilya|al(\s|-)?Nabi Rubin|Nahf|al(\s|-)?Nahr|Nawaqir|al(\s|-)?Qubsi|al(\s|-)?Rama/i
        regex[6]=/Church of the Nativity|Church of St. Catherine of Alexandria|Carmel of the Holy Child Jesus|Carmel of the Child Jesus|Church of the Nativity|Episcopal Diocese Of Jerusalem|Church of All Nations|Holy Monastery of Saint Nicholas/i
        regex[7]=/Kathisma Church|Chapel of the Ascension|The Franciscans Chapel(by the Stateion 7)?|Chapel of Saint Vincent de Paul|Chapel of Simon of Cyrene|Co-Cathedral of the Diocese of Jerusalem|Armenian Patriarchate of Jerusalem|Holy Trinity Cathedral/i
        regex[8]=/Church of St\.? Mary of Agony|Ethiopian Monastery|Vincent de Paul Chapel|Chiesa Dell'?Ascensione|Coptic Orthodox Patriarchate Jerusalem|Latin Patriarchate of Jerusalem|The Monastery of Saint Saviour|Greek Catholic Church of St\.? Veronica/i
        regex[9]=/Auguste Victoria|Coptic Church of St\.? Helen|Church of Saint Alexander Nevskiy|Emmaus Nicopolis|St Mark'?s Syriac Church|Pools of Bethesda|Jerusalem Baptist Church|Dominus Flevit Church|St\.? James Cathedral Church|St\.? George'?s Monastery/i
    // ===================================================
    if(typeof title === "undefined" || !check_regex(regex,title)){
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


async function get_data(url,callback){
    var post = {};
    request(url,function (error, response, body) {
            try{
            var Json = JSON.parse(convert.xml2json(body, {compact: false, spaces: 4}));
            }catch(err){
                return callback({});
            }
            if (url != 'https://jacobin.com/feed/' && url != 'http://theconversation.edu.au/articles'){
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
                                post["title"] =decode(element[j]["attributes"]["title"] ||element[4]['elements'][0]['text']);
                            }; 
                        }
                        return callback(post);
                    }
                }
            }
    
        });

    
}

async function main (links){
    let time = 0;
    for(let i =0;i<links.length;i++){
         get_data(links[i],function(res){
            if (res !={} ){
            check_url(db,res,function(res,v){
                if(v){
                    setTimeout(()=>{Bot.getSubreddit(process.env.SUB_REDDIT).submitLink({title: res['title'], url: res['link']});console.log("posted :"+res['title'])},60000*time)
                    time++;  
                }
            });
        }
        });
    
    }

}



module.exports= {   

    main:main,
    links:links 
    }
