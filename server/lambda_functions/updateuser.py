import json
import pymongo
from pymongo import MongoClient

client = MongoClient("mongodb+srv://user:nzlvJNAM63DNMlAB@cluster0.wlgu2.mongodb.net/TestData?retryWrites=true&w=majority")
db = client.TestData

userCollection = db.Users

def lambda_handler(event, context):
    if event['body']:
        body = json.loads(event['body'])

        if 'userId' in body:
            userId = body['userId']
        else:
            return {
                'statusCode': 401,
                'headers': {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'OPTIONS,POST'
                },
                'body': json.dumps('User cannot be blank')
            }


    existingUser = userCollection.find_one({'userId':userId}) or None

    if not existingUser:
        return {
            'statusCode': 401,
            'headers': {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            'body': json.dumps('User not found')
        }

    newvalues = { "$set": body }

    userCollection.update_one({"userId": userId}, newvalues)
    updatedUser = userCollection.find_one({'userId':userId})
    
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,POST'
        },
        'body': json.dumps(updatedUser, default=str)
    }
