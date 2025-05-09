from src.Bot import Bot
import requests as rq
class Mastodon(Bot):
    def __init__(self,instance,TIME_ZONE,file):
        super().__init__(instance,TIME_ZONE,file)
        self.access_token = instance['ACCESS_TOKEN']
    def make_post(self):
        print("hi from post")
        status = f"{self.post['title']}\n\n{self.post['link']}"      
        rq.post("https://freefree.ps/api/v1/statuses", headers= {
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
        "authorization": f"Bearer {self.access_token}",
        "content-type": "application/json",
        "Referer": "https://freefree.ps/@ali",
    }
      ,json = {"status":status}
        )
