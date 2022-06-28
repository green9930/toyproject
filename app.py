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