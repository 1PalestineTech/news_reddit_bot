'use strict';
const snoowrap = require('snoowrap');

const Bot = new snoowrap({
  userAgent: 'Ali-aaa',
  clientId: 'pZZiSIVW5zLPa6Cl81KRiA',
  clientSecret: 'CpyzUej-A7NnOug73F82kYgeHauvIg',
  refreshToken: '96378543905824-zb-wuJx9NWnBYmBYofbRWWS2ChXLvw'
});



Bot.getSubreddit('ali_bot').submitLink({title: 'I found a cool website', url: 'https://google.com'})
