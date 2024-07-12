# news_reddit_bot
bot that fetch news and post it in subreddit
# set the bot
to set the bot visit https://www.reddit.com/prefs/apps make app as script and set redirect url to https://not-an-aardvark.github.io/reddit-oauth-helper/  
then visit https://not-an-aardvark.github.io/reddit-oauth-helper/ and get refresh token from there then put them in the config file
```
SUB_REDDIT = 'sub where you want post news'
userAgent = 'random string'
clientId = 'your client id'
clientSecret = 'your clientsecret'
refreshToken = 'your refrech token'
```
if you can post only specified titles use regex  

links is for where you will get news 

time range used so if news older then this range it will not get posted

post time the break between each post


