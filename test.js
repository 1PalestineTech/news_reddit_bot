let conf=require('./config.json')
let text="ali4com\\"
regex=RegExp(conf.regex[2])
console.log(regex)
console.log(text.search(new RegExp(conf.regex[2],'i')))