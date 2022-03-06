# Smart Lock Box API

The smart lock prototype API uses AWS Lambdas in Python and MongoDB.

The API allows:

- Create a User
- Update a User
- Sign in
- Get the history of a box's status by ID
- Get the last status of a box by ID
- Get the history of multiple boxes by ID
- Update the status of a box by ID

This documentation goes through the use of the APIs. The deployed API can be accessed using https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/ instead of localhost.

[Notes and Areas of Improvement](#notes-and-areas-of-improvement)  

## Setup

This API is build using AWS Lambdas. If you wish to run the code locally check the following [documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-invoke.html). The code to build the different lambda functions are provided in [this](https://github.com/meghanlo/capstone.git) repository. 

1. Clone this repo

```
git clone https://github.com/meghanlo/capstone.git
cd capstone/server
```

2. Create a virtual environment using `virtualenv <my_env_name>` . If you do not have `venv` installed run `pip install virtualenv` 

Note: this assumes using iOS or Linux, if you are on Windows, please check the official [documentation](https://docs.python.org/3/library/venv.html) to set up your virtual environment
3. Activate your virtual environment using `source <my_env_name>/bin/activate` 

Note: this assumes using iOS or Linux, if you are on Windows, please check the official [documentation](https://docs.python.org/3/library/venv.html) to set up your virtual environment
4. `pip install requirements.txt`
5. Download [Postman](https://www.postman.com/downloads/)
6. Open Postman and go to `https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/`

## Data Types

#### User
Fields

```GraphQL
 _id: ObjectId(),
  firstName: String,
  lastName: String,
  userId: String,
  password: String,
  boxId: [String],
```

#### Box Status

Fields

```GraphQL
  _id: ObjectId(),
  boxId: String,
  lastUpdated: Date,
  isAccessDoorLocked: Boolean,
  isAccessDoorOpen: Boolean,
  isMainDoorLocked: Boolean,
  isMainDoorOpen: Boolean,
  isPackageInside: Integer,
```

## Endpoints

#### Get History
**GET** `/gethistory`

Find the status history of a box by box canonical id (query parameters)

`https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/gethistory?boxId=<boxId>`

If there are multiple boxes, the query can look like this:
`https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/gethistory?boxId=<boxId>&boxId=<boxId>`

**JSON response**

```JSON
[
    {
        "lastUpdated": "2022-03-02 11:22:52.422000",
        "boxId": "1",
        "isMainDoorLocked": true,
        "isMainDoorOpen": false,
        "isAccessDoorLocked": true,
        "isAccessDoorOpen": false,
        "isPackageInside": 1
    },
    {
        "lastUpdated": "2022-03-02 11:22:33.044000",
        "boxId": "1",
        "isMainDoorLocked": true,
        "isMainDoorOpen": false,
        "isAccessDoorLocked": true,
        "isAccessDoorOpen": false,
        "isPackageInside": 1
    },
    {
        "lastUpdated": "2022-03-02 11:21:59.242000",
        "boxId": "1",
        "isMainDoorLocked": false,
        "isMainDoorOpen": false,
        "isAccessDoorLocked": true,
        "isAccessDoorOpen": false,
        "isPackageInside": 1
    },
    {
        "lastUpdated": "2022-02-08 16:10:43.759000",
        "boxId": "1",
        "isMainDoorLocked": false,
        "isMainDoorOpen": false,
        "isAccessDoorLocked": true,
        "isAccessDoorOpen": false,
        "isPackageInside": 0
    },
    {
        "boxId": "1",
        "lastUpdated": "2022-02-03 18:40:22.712000",
        "isAccessDoorLocked": false,
        "isAccessDoorOpen": false,
        "isMainDoorLocked": false,
        "isMainDoorOpen": false,
        "isPackageInside": 0
    }
]
```

#### Get Last Status
**GET** `/getlaststatus`

Find the last status of a box by box canonical id (query parameters)

`https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/getlaststatus?boxId=<boxId>`

**JSON response**
```JSON
{
    "_id": "621f538c490cf4d81f388d63",
    "lastUpdated": "2022-03-02 11:22:52.422000",
    "boxId": "1",
    "isMainDoorLocked": true,
    "isMainDoorOpen": false,
    "isAccessDoorLocked": true,
    "isAccessDoorOpen": false,
    "isPackageInside": 1
}
```

#### Create a user
**POST** `https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/createuser`

Input Request Body

```GraphQL
{
    "userId": "testuser@gmail.com",
    "password": "thisisinsecure",
    "firstName": "TEST",
    "lastName": "TEST",
    "boxId": "1"
}
```

**JSON response**
This request will return `"User created successfully"` if the operation is successful. Or it will return an error such as `"User already exists"` if it is not.


#### Sign in a user
**POST** `https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/login`

Input Request Body

```GraphQL
{
    "userId": "testuser@gmail.com",
    "password": "thisisinsecure",
}
```

**JSON response**

```JSON
{
    "_id": "621eb356a287e79b9aa64f89",
    "userId": "testuser@gmail.ca",
    "password": HASH,
    "boxId": "1",
    "firstName": "TEST",
    "lastName": "TEST"
}
```


#### Update Box Status
**POST** `https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/updatestatus`

Input Request Body

```GraphQL
{
    "boxId": "1",
    "isMainDoorLocked": true,
    "isMainDoorOpen": false,
    "isAccessDoorLocked": true,
    "isAccessDoorOpen": false,
    "isPackageInside": 1
}
```

**JSON Response**
This request will return `"Status updated successfully"` if the operation is successful. Or it will return an error if it is not.


#### Update a User
**POST** ``https://k83w0o98ej.execute-api.us-east-1.amazonaws.com/prod/updateuser`

Input Request Body

```GraphQL
{
    "userId": "testuser@gmail.ca",
    "firstName": "updatedName"
}
```

**JSON Response**
This request will return `"Status updated successfully"` if the operation is successful. Or it will return an error if it is not.

