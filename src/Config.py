class Config:
    def __init__(self, instance):
        self.name = instance['name']
        self.links = instance['links']
        self.regex = instance['regex']
        self.filters = instance['filters']
        self.max_file_size = instance['max_file_size']
        self.time_rang_m = instance['time_rang_m']
        self.time_rang_h = instance['time_rang_h']
        self.post_time_s = instance['post_time_s']
        self.post_time_m = instance['post_time_m']
        self.active = instance['flag']