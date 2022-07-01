import requests
from flask import Flask, render_template, request, jsonify
from bs4 import BeautifulSoup
from pymongo import MongoClient
import certifi
from dotenv import load_dotenv
import os
from datetime import datetime

app = Flask(__name__)

load_dotenv()
MONGODB_URL = os.getenv('MONGODB_URL')

ca = certifi.where()
client = MongoClient(MONGODB_URL, tlsCAFile=ca)
db = client.toyprojectdb


@app.route('/')
def home():
    return render_template('index.html')

# BACKGROUND ----------------------------------------------------------------- #


# WEATHER -------------------------------------------------------------------- #


# TODOLIST ------------------------------------------------------------------- #
#======================================================== todo-list 글 작성(엔터 눌렸을 때)
@app.route("/todoWriteAction", methods=["POST"])
def todoWriteAction():
    todo_receive = request.form['togoVal']
    done_receive = int(request.form['doneVal'])
    num_receive = request.form['numVal']

    now = datetime.now()
    doc = {
        'todo': todo_receive,
        'done':done_receive,
        'num':num_receive,
        'dateTime':now
    }
    print(doc)
    db.todo.insert_one(doc)
    return jsonify({'msg': '완료!'})

#====================================================================todo-list 글 가져옴
@app.route("/getTodoList", methods=["GET"])
def getTodoList():
    all_todo = list(db.todo.find({},{'_id':False}))
    print(all_todo)
    return jsonify({'msg': all_todo})

#======================================================================todo-list 글 수정
@app.route("/todoModify", methods=["POST"])
def todoModify():
    data_receive = request.form['modiData']
    num_receive = request.form['modiNum']
    doc = {
        'todo':data_receive,
        'num':num_receive
    }
    print(data_receive, num_receive)
    db.todo.update_one({'num':num_receive},{'$set':{'todo':data_receive}})
    return jsonify({'msg': '완료!'})

#======================================================================todo-list 글 지움
@app.route("/deleteAction", methods=["POST"])
def deleteAction():
    num_receive = request.form['todoNum']
    print('잉')
    print(num_receive)
    doc = {
        'num':num_receive
    }
    print(doc)
    db.todo.delete_one(doc)
    return jsonify({'msg': '완료!'})

# ===========================================================================todo실행여부
@app.route("/todoDoneAction", methods=["POST"])
def todoDoneAction():
    num_receive = request.form['doneNum']
    done_receive = int(request.form['doneFT'])
    doc = {
        'num':num_receive
    }
    print(doc)
    db.todo.update_one({"num":num_receive},{'$set':{'done':done_receive}})
    return jsonify({'msg': '완료!'})
# QUOTE ---------------------------------------------------------------------- #


# DB TEST -------------------------------------------------------------------- #
@app.route('/dbtest', methods=['POST'])
def dbtest_post():
    text_receive = request.form['text_give']

    doc = {
        'text': text_receive,
    }
    db.testdb.insert_one(doc)
    return jsonify({'msg': 'MONGODB TEST SUCCESS'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
