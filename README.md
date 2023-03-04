<h1 align="center">ExpressJS - nontonYuk RESTfull API</h1>

nontonYuk is cinema ticketing web application.
[More about Express](https://en.wikipedia.org/wiki/Express.js)

## Built With

[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.12.13-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements

1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## How to run the app ?

1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name #nama_database, and Import file sql to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:3000/)
8. You can see all the end point [here](https://documenter.getpostman.com/view/20144091/UVyysYJr)

## Remote Database

AWS cloud
```
Hostname = ec2-44-202-197-206.compute-1.amazonaws.com
Port = 3306
Username = fw6doni
Password = Gswxo04!
```

[db4free](https://www.db4free.net/)
```
Hostname = ec2-44-202-197-206.compute-1.amazonaws.com
Port = 3306
Username = fw6doni
Password = Gswxo04!
```

note: don't drop or remove table and database

## Deploy Link

- Link : https://itjobsproject.herokuapp.com/

## Demo Accounts

1. user account : user@mail.com
   <br>
   password : 12345
2. admin account : admin@mail.com
   <br>
   password : 12345

## Set up .env file

Open .env file on your favorite code editor, and copy paste this code below :

```
PORT= // Port on local machine

MYSQL_HOST= 
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=

REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

CLOUDINARY_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

MAIL_CLIENT_ID=
MAIL_CLIENT_SECRET=
MAIL_REFRESH_TOKEN=

MIDTRANS_PRODUCTION=
MIDTRANS_SERVER_KEY=
MIDTRANS_CLIENT_KEY=

URL= // Deploy api url
```

### JSON Format

The JSON format of the status pages can be often preferable, for example when the tooling or integration to other systems is easier to achieve via a common data format.

The status values follow the same format as described above - OK, and ERROR Message.

The equivalent to the status key form the plain format is a status key in the root JSON object. Subsystems should use nested objects also having a mandatory status key. Here are some examples:

**succes result**

```
{
    "status": 200,
    "msg": "succes get data",
    "data": [
        {
            data
        },
    ],
    pagination": {
        "page": 1,
        "totalPage": 22,
        "limit": 2,
        "totalData": 43
    }
}

```

**data null result**

```

{
    "status": 200,
    "msg": "succes get data",
    "data": [],
    "pagination": {
        "page": 1,
        "totalPage": 3,
        "limit": 10,
        "totalData": 0
    }
}

```

**error request result**

```
{
    "status": 404,
    "msg": "Bad request,
    "data": null
}
```


## License

© [Bagus Tri Harjanto](https://github.com/bagusth15/)
