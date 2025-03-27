import sqlite3,time,datetime,pytz,os,re,html,praw,json
import bs4 as bs 
import requests as rq
from dateutil import parser
from requests_oauthlib import OAuth1Session

class BOT():
    def __init__(self,instance,TIME_ZONE,conf):
        self.conf=conf
        self.db=None
        self.name=instance['name']
        self.links = instance['links']
        self.regex = instance['regex']
        self.max_file_size = instance['max_file_size']
        self.time_rang_m = instance['time_rang_m']
        self.time_rang_h = instance['time_rang_h']
        self.post_time_s = instance['post_time_s']
        self.post_time_m = instance['post_time_m']
        self.TIME_ZONE=TIME_ZONE
        self.post={}
        self.flag=True
    def get_db(self):
        
        self.db = sqlite3.connect('data.db')
        
    def close(self):
        
        self.db.close()
    def write_log(self,val,file = './log.txt'):
        val+="\n" + str(datetime.datetime.now(pytz.timezone(self.TIME_ZONE))) + "\n================================ \n"
        if os.path.isfile(file):
            with open(file, 'r+') as f:
                content = f.read()
                f.seek(0)
                f.write(val.rstrip('\r\n') + '\n' + content)
        else:
            with open(file, 'w') as f:
                f.write(val.rstrip('\r\n')  )
    def get_data(self,url):
        self.post["title"]=""
        self.post["link"]=""
        self.post["log"]=""
        self.post["date"]=""
        header = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36" ,
    'referer':'https://www.google.com/'
    }
        now=time.mktime(datetime.datetime.now().timetuple())
        try:
            prased = bs.BeautifulSoup(rq.get(url,headers=header).text, "xml")
        except:
            self.flag=False
            return 
        data = prased.findAll('entry')
        if len(data)>1:
            self.post["title"] = html.unescape(data[0].findAll('title')[0].text)
            self.post["link"] = data[0].findAll('link')[0].attrs['href']
            date = data[0].findAll('published')[0].text 
        else:
            data = prased.findAll('item')
            self.post["title"] = html.unescape(data[0].findAll('title')[0].text)
            self.post["link"] = data[0].findAll('link')[0].text
            try:
                date = data[0].findAll('pubDate')[0].text 
            except:
                self.post["date"] = data[0].findAll('dc:date')[0].text 
        p_date=date
        date = time.mktime(parser.parse(date).timetuple())
        if (now - date) > 0 and (now - date) > (self.time_rang_h*60+self.time_rang_m)*60:
            self.write_log("no new news from :" +url+"\n last news was at  :" +p_date,"./"+self.name+".txt") 
            self.flag=False
            return
        self.post["log"]="detected new data from :" +url +"\n"+"now testing regex:" +url +"\n"
        self.flag=True
    
        
    def check_regex(self,text):
        
        if len(self.regex) == 0:
            self.flag=True
            return
        for regex in self.regex:
            if bool(re.search(regex,text,flags = re.IGNORECASE)):
                self.flag=True
                return
        self.flag=False
    def check_url(self):
        title = self.post['title']
        self.check_regex(title)
        if not self.flag:
            self.post["log"] += "regex didn't match "  +"\n"
            self.flag=False
            return
        else:
            self.post["log"] += "regex matched \n"
        
        cursor = self.db.execute("SELECT * FROM urls WHERE url = (?) AND sub=(?)",(self.post["link"],self.name))
        rows = cursor.fetchall()
        if len(rows) == 0:
            cursor = self.db.execute('INSERT INTO urls ("url","sub") VALUES (?,?)',(self.post["link"],self.name))    
            self.db.commit()   
            
            self.post["log"]+="posted : "+self.post["title"] +"\n"
            self.flag=True
        else:
            self.post["log"] += "we aleardy posted it \n" 
            self.flag=False
    def run(self):
        while True:
            for link in self.links.keys():
                self.get_db()
                with open('./config.json', 'r') as f:
                    config = json.load(f)
                if config !=self.conf :
                    return
                try:
                    self.get_data(link)
                    self.check_url()  
                    if self.flag:  
                        self.make_post()  
                        self.write_log(self.post["log"],"./"+self.name+".txt")
                        time.sleep(self.post_time_s+self.post_time_m*60)
                        file_stats = os.stat("./"+self.name+".txt")
                        if file_stats.st_size / (1024 * 1024)>=self.max_file_size:
                            with open('./' + self.name +'.txt', 'w') as f:
                                        f.write('')
                except Exception as e:
                    self.write_log(f"Critical error: {str(e)}", "./"+self.name+".txt")
                    time.sleep(30)
                self.post = {}
                self.close()

class Reddit(BOT):
    def __init__(self,instance,TIME_ZONE,config):
        super().__init__(instance,TIME_ZONE,config)
        self.subs = instance['SUB_REDDIT']
        self.reddit = praw.Reddit(
    client_id = instance['clientId'],
    client_secret = instance['clientSecret'],
    refresh_token = instance['refreshToken'],
    user_agent = instance['userAgent'])
    def make_post(self):
        for sub in self.subs: 
            self.reddit.subreddit(sub).submit(self.post['title'], url=self.post['link'])


class Twitter(BOT):
    def __init__(self,instance,TIME_ZONE,config):
        super().__init__(instance,TIME_ZONE,config)
        self.tags=instance['tags']
        self.oauth = OAuth1Session(
    instance['CONSUMER_KEY'],
    client_secret=instance['CONSUMER_SECRET'],
    resource_owner_key=instance['ACCESS_KEY'],
    resource_owner_secret=instance['ACCESS_SECRET'],
)
    def make_post(self):
        tags = " ".join(self.tags)
        sampletweet=f"{self.post['title']}\n{tags}\n\n{self.post['link']}"
        self.oauth.post("https://api.twitter.com/2/tweets",json={"text": sampletweet})
            
class Mardon(BOT):
    def __init__(self,instance,TIME_ZONE,config):
        super().__init__(instance,TIME_ZONE,config)
        self.access_token = instance['ACCESS_TOKEN']
    def make_post(self):
        print("hi from post")
        status=f"{self.post['title']}\n\n{self.post['link']}"      
        rq.post("https://freefree.ps/api/v1/statuses", headers= {
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "authorization": f"Bearer {self.access_token}",
        "content-type": "application/json",
        "Referer": "https://freefree.ps/@ali",
    }
      ,json = {"status":status}
        )

    