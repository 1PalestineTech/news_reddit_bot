from time import sleep
import datetime
import re
import sqlite3
import requests as rq
import time
from dateutil import parser
import bs4 as bs
import json
import praw
import threading
import os
import html
import os.path
import pytz
TIME_ZONE = os.environ['time_zone']
def write_log(val,file = './logger.txt'):
    val+="\n" + str(datetime.datetime.now(pytz.timezone(TIME_ZONE))) + "\n================================ \n"
    if os.path.isfile(file):
        with open(file, 'r+') as f:
            content = f.read()
            f.seek(0)
            f.write(val.rstrip('\r\n') + '\n' + content)
    else:
        with open(file, 'w') as f:
            f.write(val.rstrip('\r\n')  )
    
def check_regex(regexs,text):
    if len(regexs) == 0:
        return True
    for regex in regexs:
        if bool(re.search(regex,text,flags = re.IGNORECASE)):
            return True
    return False
def check_url(db,res,regex,sub):
    title = res['title']
    if not check_regex(regex,title):
        res["log"] += "regex didn't match "  +"\n"
        return (res,False)
    else:
        res["log"] += "regex matched \n"
    cursor = db.execute("SELECT * FROM urls WHERE url = (?) AND sub=(?)",(res["link"],sub))
    rows = cursor.fetchall()
    if len(rows) == 0:
        cursor = db.execute('INSERT INTO urls VALUES (?,?)',(res["link"],sub))    
        db.commit()   
        res["log"]+="posted : "+res["title"] +"\n"
        return (res,True)
    else:
        res["log"]+="we aleardy posted it \n" 
        return (res,False)

def get_data(url,time_rang_h,time_rang_m,sub):
    header = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36" ,
    'referer':'https://www.google.com/'
    }
    post = {}
    now=time.mktime(datetime.datetime.now().timetuple())
    try:
        prased = bs.BeautifulSoup(rq.get(url,headers=header).text, "xml")
    except:
        return (post,False)
    data = prased.findAll('entry')
    if len(data)>1:
        post["title"] = html.unescape(data[0].findAll('title')[0].text)
        post["link"] = data[0].findAll('link')[0].attrs['href']
        date = data[0].findAll('published')[0].text 

    else:
        data = prased.findAll('item')
        post["title"] = html.unescape(data[0].findAll('title')[0].text)
        post["link"] = data[0].findAll('link')[0].text
        try:
            date = data[0].findAll('pubDate')[0].text 
        except:
            post["date"] = data[0].findAll('dc:date')[0].text 
    date = time.mktime(parser.parse(date).timetuple())
    if (now - date) >(time_rang_h*60+time_rang_m)*60:
        write_log("no new news from :" +url,"./"+sub+".txt")
        return (post,False)
    post["log"]="detected new data from :" +url +"\n"+"now testing regex:" +url +"\n"
    return (post,True)

def url_test(url):
    header = {
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36" ,
    'referer':'https://www.google.com/'
    }
    post = {}

    try:
        prased = bs.BeautifulSoup(rq.get(url,headers=header).text, "xml")
    except:
        return  "error link not working"
    data = prased.findAll('entry')
    if len(data)>1:
        post["title"] = html.unescape(data[0].findAll('title')[0].text)
        post["link"] = data[0].findAll('link')[0].attrs['href']
        post["date"]= data[0].findAll('published')[0].text 
    else:
        data = prased.findAll('item')
        post["title"] = html.unescape(data[0].findAll('title')[0].text)
        post["link"] = data[0].findAll('link')[0].text
        try :
            post["date"] = data[0].findAll('pubDate')[0].text 
        except:
            post["date"] = data[0].findAll('dc:date')[0].text 
    return str(post)

def tread(instance):
    db=sqlite3.connect('data.db')
    links = instance['links']
    SUB_REDDIT = instance['SUB_REDDIT']
    regex = instance['regex']
    max_file_size = instance['max_file_size']
    time_rang_m = instance['time_rang_m']
    time_rang_h = instance['time_rang_h']
    post_time_s = instance['post_time_s']
    post_time_m = instance['post_time_m']
    userAgent = instance['userAgent']
    clientId = instance['clientId']
    clientSecret = instance['clientSecret']
    refreshToken = instance['refreshToken']
    if instance['flag']:
        reddit = praw.Reddit(
    client_id = clientId,
    client_secret = clientSecret,
    refresh_token = refreshToken,
    user_agent = userAgent,)
        for link in links.keys():
            try:
                re,f = get_data(link,time_rang_h,time_rang_m,SUB_REDDIT)
                if f:
                    re,f = check_url(db,re,regex,SUB_REDDIT)
                    if f:
                        reddit.subreddit(SUB_REDDIT).submit(re['title'], url=re['link'])
                        sleep(post_time_s+post_time_m*60)
                        write_log(re["log"],"./"+SUB_REDDIT+".txt")
                        file_stats = os.stat("./"+SUB_REDDIT+".txt")
                        if file_stats.st_size / (1024 * 1024)>=max_file_size:
                                with open('./' + SUB_REDDIT +'.txt', 'w') as f:
                                    f.write('')
            except:
                pass
           

        


def main():
    while True:
        with open('./config.json', 'r') as f:
            config = json.load(f)
        threads=[]
        for instance in config['instances']:
            threads.append(threading.Thread(target=tread, args=(instance,)))
        for th in threads:
            th.start()
        for th in threads:
            th.join()
        sleep(60*2)

