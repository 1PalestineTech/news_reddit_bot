## reddit / twitter news poster
Python bot that fetch news form news websites and post them in subreddits or telegram account  
this bot have Docker version you can find it in ``ali141/news_bot/``

## Requirement 
to run this bot you need :  
reddit id reddit client secret and reddit acces token you can get client id and client secret by making app at ``https://www.reddit.com/prefs/apps/`` make app and  in the redirect url use ``https://not-an-aardvark.github.io/reddit-oauth-helper/``  
then to get access token visit ``https://not-an-aardvark.github.io/reddit-oauth-helper/`` put cour client id and client secret then chose  scop that the bot use and then click generate  
you need also twitter Consumer Id and Consumer Token and Access Key and Access Secret yu can get them from ``https://developer.x.com/en/portal/products/basic`` 

if you running it in your pc you need python installed in your device if you using docker image you need docker installed
## Bot Configuration
### reddit configuration 
the basic empty configuration for reddit look like this :
```
{
      "instances": [
            {
                  "name": "",
                  "instance_type": "reddit",
                  "SUB_REDDIT": [""],
                  "userAgent": "",
                  "clientId": "",
                  "clientSecret": "",
                  "refreshToken": "",
                  "regex": [],
                  "links": {},
                  "max_file_size": 1,
                  "post_time_s": 0,
                  "post_time_m": 0,
                  "time_rang_m": 0,
                  "time_rang_h": 0,
                  "flag": false
            },
      ]
}
```
instance is list of all bot that we running each one have different configuration and links source it can have as much as element you want to have  
inside instance there is obect represent bot configurations for each instance it have :
- **name** it represent the name that will be display in the Web UI also name of the file where the bot will log data for this instance
- **instance_type** represent the type of the instance it can be reddit or twitter
- **SUB_REDDIT** list of the subreddit where the bot will post using this configuration
- **userAgent** , **clientId** , **clientSecret** and **refreshToken** are token that you get from ``https://www.reddit.com/prefs/apps/`` and ``https://not-an-aardvark.github.io/reddit-oauth-helper/``
- **regex** is list regexs to check in title of the news before posting it if it match regex it post the news
- **links** object  represent the links from where to fetch news the key is the news feed link the value is discription about the news
- **max_file_size** max size of the log file in maga bytes if it get larger then this value it get cleanned to in empty file
-  **post_time_s** **post_time_m** the time gap between each post minutes + seconds
-  **time_rang_m** **time_rang_h** the time range of news minute + hours if news is older then this it don't get posted
-  **flag** it used to turn bot OFF and ON
### twitter configuration 
the basic empty configuration for twitter look like this :
```
{
      "instances": [
     
            {
                  "name": "",
                  "instance_type": "",
                  "tags": [],
                  "CONSUMER_KEY": "",
                  "CONSUMER_SECRET": "",
                  "ACCESS_KEY": "",
                  "ACCESS_SECRET": "",
                  "regex": [],
                  "links": {},
                  "max_file_size": 1,
                  "post_time_s": 0,
                  "post_time_m": 0,
                  "time_rang_m": 0,
                  "time_rang_h": 0,
                  "flag": true
            }
      ]
}
```
- **name** it represent the name that will be display in the Web UI also name of the file where the bot will log data for this instance
- **instance_type** represent the type of the instance it can be reddit or twitter
- **tags** the hashtag that the bot use for each post
- **CONSUMER_KEY** , **CONSUMER_SECRET** , **ACCESS_KEY** and **ACCESS_SECRET** are token that you get from ``https://developer.x.com/en/portal/products/basic``
- **regex** is list regexs to check in title of the news before posting it if it match regex it post the news
- **links** object  represent the links from where to fetch news the key is the news feed link the value is discription about the news
- **max_file_size** max size of the log file in maga bytes if it get larger then this value it get cleanned to in empty file
-  **post_time_s** **post_time_m** the time gap between each post minutes + seconds it shoule be bigger then 15 min cuz this the rate limit of twitter api
-  **time_rang_m** **time_rang_h** the time range of news minute + hours if news is older then this it don't get posted
-  **flag** it used to turn bot OFF and ON
### Remarque :
you can run twitter bot and reddit bot together like adding them both to the instance list but it better to not do that cuz for each twitter bot it take 15 min to post new thing and the python code use multi thread for each instance and  wait until all instance finish their to run again so if you run twitter with reddit the twitter instance may take larger time and hold the bot so it will be no new news in reddit untill twitter bot finish it job

## The web UI 
