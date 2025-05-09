import re
class Checker:
    def __init__(self,instance):
        self.instance = instance 
    def check_regex(self,text):
        if len(self.instance.configuration.regex) == 0:
            self.instance.flag = True
            return
        for regex in self.instance.configuration.regex:
            if bool(re.search(regex, text, flags = re.IGNORECASE)):
                self.instance.flag = True
                return
        self.instance.flag = False
    def filter(self, text):
        if not self.instance.flag:
            return
        for regex in self.instance.configuration.filters:
            if bool(re.search(regex, text, flags = re.IGNORECASE)):
                self.instance.flag = False
                return
    def check_url(self):
        title = self.instance.post['title']
        self.check_regex(title)
        self.filter(title)
        if not self.instance.flag:
            self.instance.post["log"] += "Regex didn't match and/or Filter didn't pass"  + "\n"
            return
        else:
            self.instance.post["log"] += "Regex matched and Filter passed\n"
        
        cursor = self.instance.db.execute("SELECT * FROM urls WHERE url = (?) AND sub=(?)",
                                           (self.instance.post["link"], self.instance.configuration.name))
        rows = cursor.fetchall()
        if len(rows) == 0:
            cursor = self.instance.db.execute('INSERT INTO urls ("url","sub") VALUES (?,?)', 
                                              (self.instance.post["link"], self.instance.configuration.name))    
            self.instance.db.commit()   
            self.instance.post["log"] += "posting: " + self.instance.post["title"] + "\n"
            self.instance.flag = True
        else:
            self.instance.post["log"] += "we aleardy posted it \n" 
            self.instance.flag = False