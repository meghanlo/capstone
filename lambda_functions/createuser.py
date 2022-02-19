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
                'body': json.dumps('User cannot be blank')
            }

        if 'password' in body:
            password = body['password']
        else:
            return {
                'statusCode': 401,
                'body': json.dumps('Password cannot be blank')
            }
    else:
        return {
                'statusCode': 401,
                'body': json.dumps('Request missing body')
            }

    existingUser = userCollection.find_one({'userId':userId}) or None

    if existingUser:
        return {
            'statusCode': 401,
            'body': json.dumps('User already exists')
        }

    userCollection.insert_one({
        "userId": userId, 
        "password": password,
        })
    
    
    return {
        'statusCode': 200,
        'body': json.dumps('User Created')
    }
