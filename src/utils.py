from time import sleep
from Bot import Reddit,Twitter,Mardon
import sqlite3,json,threading,os,html,os.path,pytz,datetime
import requests as rq
import bs4 as bs

from flask import request, render_template, session
from functools import wraps

TIME_ZONE = "Asia/Jerusalem"

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
    with open('./config.json', 'r') as f:
        config = json.load(f)
    if instance['flag'] and instance["instance_type"]=='reddit':
        reddit_bot=Reddit(instance,TIME_ZONE,config)
        reddit_bot.run()
    elif instance['flag'] and instance["instance_type"]=='twitter':
        twitter_bot=Twitter(instance,TIME_ZONE,config)
        twitter_bot.run()
    elif instance['flag'] and instance["instance_type"]=='mastodon':
        mastodon=Mardon(instance,TIME_ZONE,config)
        mastodon.run()

def main():
    while True:
        try:
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
        except:
            pass
