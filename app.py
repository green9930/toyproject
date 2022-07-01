import requests
from flask import Flask, render_template, request, jsonify
from bs4 import BeautifulSoup
from pymongo import MongoClient
import certifi
from dotenv import load_dotenv
import os

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

    db.quote.update_one({'quote': written_receive}, {'$set': {'like': like_receive, 'dislike': dislike_receive}})
    return jsonify({'msg': 'MongoDB Update 완료 ❕'})


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
