
from src.utils import main,url_test,write_log
from flask import Flask, render_template,make_response,request,redirect
import json
import threading
app = Flask(__name__)

@app.route('/',methods = ['GET'])
def index():
    with open('./config.json', 'r') as f:
        data = json.load(f)
    subs = []

    for sub in data['instances'] :
        subs.append(sub['SUB_REDDIT'])
    return render_template("logger.html",subs = subs)

@app.route('/setcookie', methods = ['POST']) 
def setcookie(): 
    resp = make_response(redirect('/'))  
    resp.set_cookie('file',request.form.get('filename')) 
    return resp 

@app.route('/get_log',methods = ['GET']) 
def get_log(): 
    try:
        filename = request.cookies.get('file') 
        with open('./'+filename +'.txt', 'r') as f:
            data = f.read()
    except:
        data = ''
    return data



@app.route('/config', methods = ['GET', 'POST']) 
def config(): 
    if request.method == 'POST':
        with open('config.json', 'w') as f:
            f.write(request.form.get('conf'))
        return redirect('/config')
    else:
        with open('./config.json', 'r') as f:
            data = f.read()
        return render_template("config.html",data = data)
    


@app.route('/get_data', methods = ['GET']) 
def get_data(): 
    with open('./config.json', 'r') as f:
        data = f.read()

    return data


@app.route('/clear_log', methods = ['POST']) 
def clear_log(): 
    filename = request.cookies.get('file') 
    with open('./'+filename +'.txt', 'w') as f:
        f.write('')
    return redirect('/')

@app.route('/test', methods = ['GET', 'POST']) 
def test_link():
    if request.method == 'POST':
        try:
            data = url_test(request.form.get('link'))
        except:
            data = "error link not working"
        return render_template('test.html',data = data)
    else:
        return render_template('test.html',data = '')


@app.route('/set_bot', methods=['POST']) 
def set_bot():
    with open('./config.json', 'r') as f:
        data = json.load(f)
    for e in data['instances']:
        if e['SUB_REDDIT'] == request.cookies.get('file') :
            if request.form.get('bot_data') == "start":
                e['flag'] = True
                text = "================ bot started    =============\n"
            else:
                e['flag'] = False
                text =  "================ bot stopped    =============\n"
    with open('./config.json', 'w') as out_file:
        json.dump(data, out_file, indent = 6)
    write_log( text,'./'+request.cookies.get('file') +'.txt')
    return redirect('/')
def start_server():
    app.run(host='0.0.0.0',port="3080")

if __name__ == '__main__':
   print("App started")
   
   server = threading.Thread(target = start_server)
   bot = threading.Thread(target = main)
   server.start()
   bot.start()
   bot.join()
   server.join()
