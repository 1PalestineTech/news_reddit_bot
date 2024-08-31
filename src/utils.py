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
from requests_oauthlib import OAuth1Session
from flask import request, render_template, session
from functools import wraps

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



def check_url(db,res,regex,name):
    title = res['title']
    if not check_regex(regex,title):
        res["log"] += "regex didn't match "  +"\n"
        return (res,False)
    else:
        res["log"] += "regex matched \n"
    cursor = db.execute("SELECT * FROM urls WHERE url = (?) AND sub=(?)",(res["link"],name))
    rows = cursor.fetchall()
    if len(rows) == 0:
        cursor = db.execute('INSERT INTO urls ("url","sub") VALUES (?,?)',(res["link"],name))    
        db.commit()   
        res["log"]+="posted : "+res["title"] +"\n"
        return (res,True)
    else:
        res["log"]+="we aleardy posted it \n" 
        return (res,False)



def get_data(url,time_rang_h,time_rang_m,name):
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
    p_date=date
    date = time.mktime(parser.parse(date).timetuple())
    if (now - date) > 0 and (now - date) > (time_rang_h*60+time_rang_m)*60:
        write_log("no new news from :" +url+"\n last news was at  :" +p_date,"./"+name+".txt") 
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
    name=instance['name']
    instance_type=instance['instance_type']
    links = instance['links']
    regex = instance['regex']
    max_file_size = instance['max_file_size']
    time_rang_m = instance['time_rang_m']
    time_rang_h = instance['time_rang_h']
    post_time_s = instance['post_time_s']
    post_time_m = instance['post_time_m']

    if instance['flag'] and instance_type=='reddit':
        userAgent = instance['userAgent']
        clientId = instance['clientId']
        clientSecret = instance['clientSecret']
        refreshToken = instance['refreshToken']
        subs = instance['SUB_REDDIT']
        reddit = praw.Reddit(
    client_id = clientId,
    client_secret = clientSecret,
    refresh_token = refreshToken,
    user_agent = userAgent)
        try:
            for link in links.keys():
                re,f = get_data(link,time_rang_h,time_rang_m,name)
                if f:
                    re,f = check_url(db,re,regex,name)
                    if f:
                        for sub in subs:
                            
                            reddit.subreddit(sub).submit(re['title'], url=re['link'])
 
                        write_log(re["log"],"./"+name+".txt")
                        sleep(post_time_s+post_time_m*60)
                        file_stats = os.stat("./"+name+".txt")
                        if file_stats.st_size / (1024 * 1024)>=max_file_size:
                            with open('./' + name +'.txt', 'w') as f:
                                f.write('')
        except:
            write_log("problem with reddit api ","./"+name+".txt")
            pass
    elif instance['flag'] and instance_type=='twitter':
        consumer_key  = instance['CONSUMER_KEY']
        consumer_secret = instance['CONSUMER_SECRET']
        access_token = instance['ACCESS_KEY']
        access_token_secret = instance['ACCESS_SECRET']
        oauth = OAuth1Session(
    consumer_key,
    client_secret=consumer_secret,
    resource_owner_key=access_token,
    resource_owner_secret=access_token_secret,
)
        tags = " ".join(instance['tags'])
        try:

            for link in links.keys():
                re,f = get_data(link,time_rang_h,time_rang_m,name)
                if f:
                    re,f = check_url(db,re,regex,name)
                    if f:        
                        sampletweet=f"""
    {re['title']}

    {tags}


    {re['link']}
    """
                        payload = {"text": sampletweet}
                        
                        response = oauth.post(
        "https://api.twitter.com/2/tweets",
        json=payload,
    )
                        
                        write_log(re["log"],"./"+name+".txt")
                        sleep(post_time_s+post_time_m*60)
                        file_stats = os.stat("./"+name+".txt")
                        if file_stats.st_size / (1024 * 1024)>=max_file_size:
                            with open('./' + name +'.txt', 'w') as f:
                                f.write('')
        except:
            write_log("problem with twitter api ","./"+name+".txt")
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
        sleep(30)


def login_required(f):
    
    @wraps(f)
    def decorated_function(*args, **kwargs):
        db = sqlite3.connect('data.db')
        if session.get("user_id") is None :
            return render_template("admin_login.html"),300
        cursor = db.execute("SELECT * FROM admins WHERE id = (?) ",(session.get("user_id"),))
        rows = cursor.fetchall()
        if len(rows) !=1 :
            return render_template("admin_login.html"),300 
        return f(*args, **kwargs)

    return decorated_function

def head_admin(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        db = sqlite3.connect('data.db')
        cursor = db.execute("SELECT * FROM head_admin WHERE id = (?) ",(session.get("user_id"),))
        rows = cursor.fetchall()
        if len(rows) !=1 :
            return render_template("error.html", top=403, bottom="no permission",url=request.path),403 
        return f(*args, **kwargs)

    return decorated_function