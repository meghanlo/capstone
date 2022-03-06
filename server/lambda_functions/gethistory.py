import json
import pymongo
from pymongo import MongoClient

client = MongoClient("mongodb+srv://user:nzlvJNAM63DNMlAB@cluster0.wlgu2.mongodb.net/TestData?retryWrites=true&w=majority")
db = client.TestData

boxStatusCollection = db.BoxStatus

def lambda_handler(event, context):
    boxId  = event['queryStringParameters']['boxId'] or '1'

    box_history = boxStatusCollection.find({"boxId":boxId}).sort('lastUpdated',pymongo.DESCENDING).limit(100)
    box_history_list = list(box_history)

    parsed_box_history = []
    for item in box_history_list:
        del item["_id"]
        parsed_box_history.append(item)

    return {
        'statusCode': 201,
        'headers': {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,GET'
        },
        'body': json.dumps(parsed_box_history, default = str)
    }
