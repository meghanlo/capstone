import flask
import json
import pymongo
from bson import json_util
from pymongo import MongoClient
from datetime import datetime
from flask import Response, request

app = flask.Flask(__name__)

client = MongoClient("mongodb+srv://user:nzlvJNAM63DNMlAB@cluster0.wlgu2.mongodb.net/TestData?retryWrites=true&w=majority")
db = client.TestData

boxStatusCollection = db.BoxStatus
userCollection = db.Users

@app.route("/")
def test():
    return "App is working"

@app.route("/create_user", methods=['POST'])
def create_user():
    userId  = request.args.get('userId', None)
    password  = request.args.get('password', None)

    existingUser = userCollection.find_one({'userId':userId}) or None
    
    if not userId:
        return Response(
            "User cannot be blank",
            status=401,
        )
    
    if not password:
        return Response(
            "Password cannot be blank",
            status=401,
        )

    if existingUser:
        return Response(
            "User already exists",
            status=401,
        )

    userCollection.insert_one({
        "userId": userId, 
        "password": password,
        })
    
    return Response(
            "User created",
            status=201,
        )

@app.route("/login", methods=['POST'])
def login():
    userId  = request.args.get('userId', None)
    password  = request.args.get('password', None)

    existingUser = userCollection.find_one({'userId':userId}) or None
    
    if not userId:
        return Response(
            "User cannot be blank",
            status=401,
        )
    
    if not password:
        return Response(
            "Password cannot be blank",
            status=401,
        )

    if not existingUser:
        return Response(
            "User does not exist",
            status=401,
        )

    if password == existingUser['password']:
        return Response(
            "Login successful",
            status=201,
        )
    else:
        return Response(
            "Login failed",
            status=401,
        )

@app.route("/update_status", methods=['POST'])
def update_status():
    boxId  = request.args.get('boxId', '1')

    #if any of the parameters are None, grab the last value from the DB
    lastBoxHistory = boxStatusCollection.find_one({'boxId':boxId},  sort=[( 'lastUpdated', pymongo.DESCENDING )])

    isMainDoorLocked  = request.args.get('isMainDoorLocked', None) or lastBoxHistory['isMainDoorLocked']
    isMainDoorOpen  = request.args.get('isMainDoorOpen', None) or lastBoxHistory['isMainDoorOpen']
    isAccessDoorLocked  = request.args.get('isAccessDoorLocked', None) or lastBoxHistory['isAccessDoorLocked']
    isAccessDoorOpen  = request.args.get('isAccessDoorOpen', None) or lastBoxHistory['isAccessDoorOpen']
    isPackageInside  = request.args.get('isPackageInside', None) or lastBoxHistory['isPackageInside']
    now = datetime.now()

    boxStatusCollection.insert_one({
        "lastUpdated": now, 
        "boxId": boxId,
        "isMainDoorLocked": str_to_bool(isMainDoorLocked), 
        "isMainDoorOpen": str_to_bool(isMainDoorOpen),
        "isAccessDoorLocked": str_to_bool(isAccessDoorLocked),
        "isAccessDoorOpen": str_to_bool(isAccessDoorOpen), 
        "isPackageInside": str_to_bool(isPackageInside),
        })
    return Response(
            "Status updated",
            status=201,
        )

@app.route("/get_last_status")
def get_last_status():
    boxId  = request.args.get('boxId', '1')
    box_history = boxStatusCollection.find_one({'boxId':boxId},  sort=[( 'lastUpdated', pymongo.DESCENDING )])
    del box_history["_id"]

    return json.dumps(box_history, default = str)

@app.route("/get_history")
def get_history():
    boxId  = request.args.get('boxId', '1')
    box_history = boxStatusCollection.find({"boxId":boxId}).sort('lastUpdated',pymongo.DESCENDING).limit(100)
    box_history_list = list(box_history)

    parsed_box_history = []
    for item in box_history_list:
        del item["_id"]
        parsed_box_history.append(item)

    return json.dumps(parsed_box_history, default = str)


def str_to_bool(s):
    if isinstance(s, bool):
        return s

    if s == 'True' or s == 'true' or s == '1':
         return True
    elif s == 'False' or s == 'false' or s == '0':
         return False
    else:
         raise ValueError