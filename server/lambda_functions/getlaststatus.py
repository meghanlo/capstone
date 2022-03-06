import json
import pymongo
from pymongo import MongoClient

client = MongoClient("mongodb+srv://user:nzlvJNAM63DNMlAB@cluster0.wlgu2.mongodb.net/TestData?retryWrites=true&w=majority")
db = client.TestData

boxStatusCollection = db.BoxStatus

def lambda_handler(event, context):
    boxId  = event['queryStringParameters']['boxId'] or '1'
    box_history = boxStatusCollection.find_one({'boxId':boxId},  sort=[( 'lastUpdated', pymongo.DESCENDING )])

    return {
        'statusCode': 201,
        'headers': {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,GET'
        },
        'body': json.dumps(box_history, default = str)
    }