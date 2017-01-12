# OAuth Server example using Koa and KoaRouter

##WORK IN PROGRESS

Note: If you need to learn how to setup the server, check out 
[https://github.com/babel/example-node-server](here).

Start by creating a new `package.json` with the command `npm init`.

Then initialize a new git with the command `git init`.

We will be using the following npm modules to build our server.
```
// installing dependencies
$ npm install koa@2 --save

$ npm install koa-router@next --save

$ npm install koa-bodyparser@next --save
```

### Environment Variables

We will store our environment variables in the `.env` file. Make sure you have installed node-foreman beforehand.
```
// node-foreman installation
$ npm install -g foreman
```

Create an `.env` file with the following variables. We can add more later.
```
// .env
PORT=3000
MONGO_URI=mongodb://localhost/koa-oauth
```
Your environment variables can be accessed from your node.js program through `process.env.PORT`, `process.env.MONGO_URI`.


### Starting the Server

Create a `PROCFILE` with the following command. We will use `nodemon` which will watch the files for changes and automatically restarts the server so that the changes can be applied.
```
// PROCFILE
web: nodemon server.js
```
You can start the server with the command `$ nf start`.
The environment variables will be loaded automatically from the `.env` file on runtime.
```terminal
$ nf start
```

### .gitignore

Create a `.gitignore` file. It should exclude the `node_modules` directory and `.env` file. This will prevent us from accidentally commiting sensitive information (password etc) to Github.

```
// .gitignore
node_modules
.env
```

If you have accidentally committed the node_modules directory, you can follow the following steps to remove them:
```
git rm -r --cached node_modules
git commit -m 'Remove the now ignored directory node_modules'
git push origin master
```

## Endpoints
Standard OAuth 2.0 / OpenID Connect endpoints

- server discovery
- server jwk set
- client registration
- authorisation
- token
- token introspection
- token revocation
- userinfo
We will create the following endpoints:
```

GET /login - Display the login form
POST /login - Submit the login request (email, password) and obtain the response (access token, refresh token)

GET /register - Display the register form
POST /register - Submit the register request (email, password) and obtain the response (access token, refresh token)

POST /logout - clears the user credentials from the server
POST /userinfo - Get the user info with the JWT token in the Authorization header
```


### Validating Request/Response

When querying from the database, you will normally need to have a `request` (e.g. id of the resource to be queried) and a `response` (the JSON object that will be returned from the user). The request can be a http `query`, `params`, or `body`, depending on the request type. Do not confuse the `requests/response` with the `Model`. `Model` is usually the representation of the resources that will be stored in the database. 

Remember that out `Models` contains all the buiness login for out application. Therefore, validation is normally carried out on the `Model`. 

In order to distinguish `Model` validation from the `request/response` validations, `schemas` are created. They are stored in the schemas folder for each services and contains the fields that are required for the request/response respectively. 

We use schemas for the following reason:

1. Fail fast -  It is wiser to detect error early by throwing the error rather than waiting for the database operation to take place first.
2. Error messages - We want to return users reasonable error messages, and therefore the schemas should define all the errors
3. Centralized checking - Rather than having our validations scattered across the app code, it's better to define them in the schema and validate the request/response just before/after the service is called
4. Transparency - The schemas serve as a standardized documentation that can be exposed to users to ease their integration with our services.
5. Testing - It's easier to test each services/endpoints because the request/repsonse is well documented. The errors messages can be tested against the different scenarios too. 
6. Comfort - I'm just comfortable with this approach, that's all. I use `ajv`, because they claim themselves to be the fastest JSON Schema validator for node.js and browser. 

# Glossary
WORK IN PROGRESS
## Service

Service is basically a part of the core business logic of the application. It takes in an input (request) and produces and output (response). The response can then be consumed by the end users through different `transports`.

Transport can be a HTTP Server (REST), or RPC.

## Endpoint

The endpoint is where a service is called and the contracts are defined. Contracts are a predefined schema of request and response for the service.