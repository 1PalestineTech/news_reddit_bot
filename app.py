
from src.utils import main,url_test,write_log,head_admin,login_required
from flask import Flask, render_template,make_response,request,redirect
from werkzeug.security import check_password_hash, generate_password_hash
import json
import threading
from flask_session import Session
import shortuuid
import sqlite3
import os
app = Flask(__name__)
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)


PORT = os.environ['PORT'] 
@app.route('/admin_login', methods = ['GET','POST'])
def login():
    db = sqlite3.connect('web_data.db')
    if request.method == "POST":

        if not request.form.get("username"):
            return render_template("error.html", top=403, bottom="must provide username",url=request.path),403 

        elif not request.form.get("password"):
            return render_template("error.html", top=403, bottom="must provide password",url=request.path),403 
        username = request.form.get('username').strip()
        password = request.form.get('password').strip()
        cursor = db.execute("SELECT * FROM admins WHERE username = (?) ",(username,))
        rows = cursor.fetchall()
        if len(rows) != 1 or not check_password_hash(rows[0][2],password):
            return render_template("error.html", top=403, bottom="invalid username and/or password",url=request.path),403 
        session["user_id"] = rows[0][0]
        return redirect("/")
    else :
        if not (session.get("user_id") is None):
            return redirect('/')
        else:
            return render_template("admin_login.html")
    
@app.route('/logout', methods = ['POST'])
def logout():
    session.clear()
    return redirect('/')

#                                        CHANGE PASSWORD
@app.route('/change_password', methods = ['GET','POST'])
@login_required
def change_password():
    db = sqlite3.connect('web_data.db')
    if request.method == "POST":
        if not request.form.get("old_password"):
            return render_template("error.html", top=403, bottom="must provide old password",url=request.path),403 

        elif not request.form.get("new_password"):
            return render_template("error.html", top=403, bottom="must provide the new password",url=request.path),403 
        old_password = request.form.get('old_password').strip()
        new_password = request.form.get('new_password').strip()
        cursor = db.execute("SELECT * FROM admins WHERE id = (?) ",(session.get("user_id"),))
        rows = cursor.fetchall()

        if len(rows) != 1 or not check_password_hash(rows[0][2],old_password):
            return render_template("error.html", top=403, bottom="wrong password",url=request.path),403
        hs=generate_password_hash(new_password) 
        db.execute("UPDATE admins SET password = (?) WHERE id = (?)",(hs,session.get("user_id")))
        db.commit()
        
        return redirect("/")
    else :
        return render_template("change_password.html")





#                                        ADD ADMIN
@app.route('/add_admin', methods = ['GET','POST'])
@login_required
@head_admin
def add_admin():
    if request.method == "POST":
        username = request.form.get('username').strip()
        password = request.form.get('password').strip()
        if not request.form.get("username"):
            return render_template("error.html", top=403, bottom="must provide username",url=request.path),403 

        elif not request.form.get("password"):
            return render_template("error.html", top=403, bottom="must provide password",url=request.path),403 
        db = sqlite3.connect('web_data.db')
        cursor = db.execute("SELECT * FROM admins WHERE username = (?) ",(username,))
        rows = cursor.fetchall()
        if len(rows)>0:
            return render_template("error.html", top=403, bottom="username aleardy exist",url=request.path),403 
        id = shortuuid.ShortUUID().random(length=20)
        hs=generate_password_hash(password)
        db.execute("INSERT INTO admins (id,username,password) VALUES ((?),(?),(?)) ",(id, username, hs))
        db.commit()
        return redirect('/remove_admin')
    else:
        return render_template("add_admin.html")





#                                        REMOVE ADMIN
@app.route('/remove_admin', methods = ['GET','POST'])
@login_required
@head_admin
def remove_admin():
    db = sqlite3.connect('web_data.db')
    if request.method == "POST":
        
        ids = request.form.getlist('admins')
        for id in ids:
            cursor = db.execute("SELECT * FROM head_admin WHERE id = (?) ",(id,))
            rows = cursor.fetchall()
            if len(rows)!=1:
                db.execute("DELETE FROM admins WHERE id = (?) ",(id,))
                db.commit()
        return redirect('/remove_admin')
    
    cursor = db.execute("SELECT * from admins where id not in (select id from head_admins) ")
    rows = cursor.fetchall()
    return render_template("remove_admin.html",admins=rows)




@app.route('/',methods = ['GET'])
@login_required
def index():
    with open('./config.json', 'r') as f:
        data = json.load(f)
    instances = []

    for instance in data['instances'] :
        instances.append(instance['name'])
    return render_template("logger.html",instances = instances)

@app.route('/setcookie', methods = ['POST']) 
def setcookie(): 
    resp = make_response(redirect('/'))  
    resp.set_cookie('file',request.form.get('filename')) 
    return resp 

@app.route('/get_log',methods = ['GET']) 
@login_required
def get_log(): 
    try:
        filename = request.cookies.get('file') 
        with open('./'+filename +'.txt', 'r') as f:
            data = f.read()
    except:
        data = ''
    return data



@app.route('/config', methods = ['GET', 'POST']) 
@login_required
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
@login_required
def get_data(): 
    with open('./config.json', 'r') as f:
        data = f.read()

    return data


@app.route('/clear_log', methods = ['POST']) 
@login_required
def clear_log(): 
    filename = request.cookies.get('file') 
    with open('./'+filename +'.txt', 'w') as f:
        f.write('')
    return redirect('/')

@app.route('/test', methods = ['GET', 'POST']) 
@login_required
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
@login_required
def set_bot():
    with open('./config.json', 'r') as f:
        data = json.load(f)
    for e in data['instances']:
        if e['name'] == request.cookies.get('file') :
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
