from src.Bot import Bot
import time,praw
class Reddit(Bot):
    def __init__(self, instance, TIME_ZONE, file):
        super().__init__(instance, TIME_ZONE, file)
        self.subs = instance['SUB_REDDIT']
        self.reddit = praw.Reddit(
    client_id = instance['clientId'],
    client_secret = instance['clientSecret'],
    refresh_token = instance['refreshToken'],
    user_agent = instance['userAgent'])
    def make_post(self):
        for sub in self.subs: 
            self.reddit.subreddit(sub).submit(self.post['title'], url = self.post['link'])
            time.sleep(30)
