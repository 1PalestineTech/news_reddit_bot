from requests_oauthlib import OAuth1Session
from src.Bot import Bot

class Twitter(Bot):
    def __init__(self,instance, TIME_ZONE, file):
        super().__init__(instance, TIME_ZONE, file)
        self.tags = instance['tags']
        self.oauth = OAuth1Session(
    instance['CONSUMER_KEY'],
    client_secret = instance['CONSUMER_SECRET'],
    resource_owner_key = instance['ACCESS_KEY'],
    resource_owner_secret = instance['ACCESS_SECRET'],
)
    def make_post(self):
        tags = " ".join(self.tags)
        sampletweet = f"{self.post['title']}\n{tags}\n\n{self.post['link']}"
        self.oauth.post("https://api.twitter.com/2/tweets", json={"text": sampletweet})
  