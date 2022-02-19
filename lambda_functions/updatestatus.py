import json
import pymongo
from datetime import datetime
from pymongo import MongoClient

client = MongoClient("mongodb+srv://user:nzlvJNAM63DNMlAB@cluster0.wlgu2.mongodb.net/TestData?retryWrites=true&w=majority")
db = client.TestData

boxStatusCollection = db.BoxStatus

def lambda_handler(event, context):
    if event['body']:
        body = json.loads(event['body'])
        
        if 'boxId' in body:
            boxId = body['boxId']
        else:
            boxId = '1'

        #if any of the parameters are None, grab the last value from the DB
        lastBoxHistory = boxStatusCollection.find_one({'boxId':boxId},  sort=[( 'lastUpdated', pymongo.DESCENDING )])

        if 'isMainDoorLocked' in body:
            isMainDoorLocked = body['isMainDoorLocked']
        else:
            isMainDoorLocked = lastBoxHistory['isMainDoorLocked']

        if 'isMainDoorOpen' in body:
            isMainDoorOpen = body['isMainDoorOpen']
        else:
            isMainDoorOpen = lastBoxHistory['isMainDoorOpen']

        if 'isAccessDoorLocked' in body:
            isAccessDoorLocked = body['isAccessDoorLocked']
        else:
            isAccessDoorLocked = lastBoxHistory['isAccessDoorLocked']

        if 'isAccessDoorOpen' in body:
            isAccessDoorOpen = body['isAccessDoorOpen']
        else:
            isAccessDoorOpen = lastBoxHistory['isAccessDoorOpen']

        if 'isPackageInside' in body:
            isPackageInside = body['isPackageInside']
        else:
            isPackageInside = lastBoxHistory['isPackageInside']

    else:
        return {
                'statusCode': 401,
                'body': json.dumps('Request missing body')
            }

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

    return {
        'statusCode': 201,
        'body': json.dumps('Status updated')
    }

def str_to_bool(s):
    if isinstance(s, bool):
        return s

    if s == 'True' or s == 'true' or s == '1':
         return True
    elif s == 'False' or s == 'false' or s == '0':
         return False
    else:
         raise ValueError