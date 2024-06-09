# news_reddit_bot
bot that fetch news and post it in subreddit
# set the bot
to set the bot visit https://www.reddit.com/prefs/apps make app as script and set redirect url to https://not-an-aardvark.github.io/reddit-oauth-helper/  
then visit https://not-an-aardvark.github.io/reddit-oauth-helper/ and get refresh token from there
create .env file with data that you need
```
SUB_REDDIT = 'sub where you want post news'
userAgent = 'random string'
clientId = 'your client id'
clientSecret = 'your clientsecret'
refreshToken = 'your refrech token'
```
# How to use
``npm install`` install all library that we need from package.json  
``npm start``  start the bot  
