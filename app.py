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

# READ TODO ------------------------------------------------------------------ #

@app.route('/todolist', methods=['GET'])
def read_todo():
    todo_list = list(db.todolist.find({}, {'_id': False}))
    return jsonify({'todolist': todo_list})


# ADD TODO ------------------------------------------------------------------- #

@app.route('/todolist', methods=['POST'])
def add_todo():
    todo_receive = request.form['todo_give']
    todo_isDone = request.form['isDone']
    todo_timestamp = request.form['timestamp']

    doc = {
        'todo': todo_receive,
        'isDone': todo_isDone,
        'timestamp': todo_timestamp,
    }

    db.todolist.insert_one(doc)
    return jsonify({'message': 'SUCCESS: UPDATE TODO'})

# TOGGLE TODO ---------------------------------------------------------------- #


@app.route('/todolist/toggletodo', methods=['POST'])
def toggle_todo():
    # old_todoText = request.form['old_todoText']
    target_timestamp = request.form['targetTimestamp']
    todo_is_done = request.form['todoIsDone']

    db.todolist.update_one({'timestamp': target_timestamp}, {
                           '$set': {'isDone': todo_is_done}})

    return jsonify({'message': 'SUCCESS: TOGGLE TODO'})

# EDIT TODO ------------------------------------------------------------------ #


@app.route('/todolist/edittodo', methods=['POST'])
def edit_todo():
    # old_todoText = request.form['old_todoText']
    target_timestamp = request.form['targetTimestamp']
    new_todoText = request.form['new_todoText']

    db.todolist.update_one({'timestamp': target_timestamp}, {
                           '$set': {'todo': new_todoText}})

    return jsonify({'message': 'SUCCESS: EDIT TODO'})

# DELETE TODO ---------------------------------------------------------------- #


@app.route('/todolist/deletetodo', methods=['DELETE'])
def delete_todo():
    target_timestamp = request.form['targetTimestamp']
    db.todolist.delete_one({'timestamp': target_timestamp})

    return jsonify({'message': 'SUCCESS: DELETE TODO'})

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


@app.route("/quote", methods=["GET"])
def quote_get():
    quote_list = list(db.quote.find({}, {'_id': False}))
    print(quote_list)
    return jsonify({'quotes': quote_list})


@app.route("/quote", methods=["POST"])
def quote_post():
    like_receive = request.form['like_give']
    dislike_receive = request.form['dislike_give']
    written_receive = request.form['written_give']

    db.quote.update_one({'quote': written_receive}, {
                        '$set': {'like': like_receive, 'dislike': dislike_receive}})
    return jsonify({'msg': 'MongoDB Update 완료 ❕'})


# QUOTE POST ----------------------------------------------------------------- #

@app.route("/quote/post", methods=["POST"])
def qoute_post_text():
    text_receive = request.form['text_give']
    quote_like = request.form['like']
    quote_dislike = request.form['dislike']

    doc = {
        'quote': text_receive,
        'like': quote_like,
        'dislike': quote_dislike,
    }

    db.quote.insert_one(doc)
    return jsonify({'msg': 'QUOTE UPDATE'})


# DB TEST -------------------------------------------------------------------- #
# @app.route('/dbtest', methods=['POST'])
# def dbtest_post():
#     text_receive = request.form['text_give']

#     doc = {
#         'text': text_receive,
#     }
#     db.testdb.insert_one(doc)
#     return jsonify({'msg': 'MONGODB TEST SUCCESS'})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
