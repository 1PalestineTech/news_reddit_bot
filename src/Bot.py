import sqlite3,time,datetime,pytz,os,json
from src.Config import Config
from src.Parser import Parser
from src.Checker import Checker
class Bot:
    def __init__(self,instance, TIME_ZONE, file):
        self.configuration = Config(instance)
        self.parser = Parser(self)
        self.checker = Checker(self)
        self.file = file
        self.db = None
        self.TIME_ZONE = TIME_ZONE
        self.flag = True
        self.post = {}
    def write_log(self,val,file = './log.txt'):
        val += "\n" + str(datetime.datetime.now(pytz.timezone(self.TIME_ZONE))) + "\n================================ \n"
        if os.path.isfile(file):
            with open(file, 'r+') as f:
                content = f.read()
                f.seek(0)
                f.write(val.rstrip('\r\n') + '\n' + content)
        else:
            with open(file, 'w') as f:
                f.write(val.rstrip('\r\n') )
    def run(self):
        while True:
            for link in self.configuration.links.keys():
                self.get_db()
                with open('./config.json', 'r') as f:
                    config = json.load(f)
                if config != self.file:
                    return
                self.parser.send_request(link)
                self.checker.check_url() 
                try:
                    if self.configuration.active and self.flag:  
                        self.make_post()  
                        self.write_log(self.post["log"], "./" + self.configuration.name + ".txt")
                        time.sleep(self.configuration.post_time_s + self.configuration.post_time_m * 60)
                        file_stats = os.stat("./" + self.configuration.name + ".txt")
                        if file_stats.st_size / (1024 * 1024) >= self.configuration.max_file_size:
                            with open('./' + self.configuration.name +'.txt', 'w') as f:
                                        f.write('')
                except Exception as e:
                    self.write_log(f"Critical error: {str(e)}", "./" + self.configuration.name + ".txt")
                    time.sleep(30)
                self.post = {}
                self.close()
    def get_db(self):
        self.db = sqlite3.connect('data.db')
    def close(self):
        self.db.close()
    