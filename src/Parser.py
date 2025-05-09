import bs4 as bs
import time,datetime,html
from dateutil import parser
import requests as rq
class Parser:
    def __init__(self,instance):
        self.instance = instance
    def get_data(self,prased,url):
        data = prased.findAll('entry')
        if len(data) > 1:
            self.instance.post["title"] = html.unescape(data[0].findAll('title')[0].text)
            self.instance.post["link"] = data[0].findAll('link')[0].attrs['href']
            date = data[0].findAll('published')[0].text 
        else:
            data = prased.findAll('item')
            self.instance.post["title"] = html.unescape(data[0].findAll('title')[0].text)
            self.instance.post["link"] = data[0].findAll('link')[0].text
            if data[0].findAll('pubDate') > 0:
                date = data[0].findAll('pubDate')[0].text 
            else:
                date = data[0].findAll('dc:date')[0].text 
        now = time.mktime(datetime.datetime.now().timetuple())
        p_date = date
        date = time.mktime(parser.parse(date).timetuple())
        time_range = (self.instance.configuration.time_rang_h * 60 + self.instance.configuration.time_rang_m) * 60
        if (now - date) > 0 and (now - date) > time_range:
            self.instance.write_log("no new news from :" + url + "\n last news was at  :" + p_date, 
                                    "./" + self.instance.configuration.name + ".txt") 
            self.instance.flag = False
            return
        self.instance.post["log"] = "detected new data from :" + url +"\n" + "now testing regex:" + url + "\n"
        self.instance.flag = True

    def send_request(self,url):
        self.instance.post["title"] = ""
        self.instance.post["link"] = ""
        self.instance.post["log"] = ""
        header = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36" ,
    'referer':'https://www.google.com/'
    }
        try:
            prased = bs.BeautifulSoup(rq.get(url,headers = header).text, "xml")
            self.get_data(prased, url)
        except:
            self.instance.flag = False
            return 
