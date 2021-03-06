# Koa REST API Architecture

A reusable REST API architecture using OpenId Connect server as an example. To find out more about the OpenId Connect, visit [here](http://openid.net/connect/). Implements practices from the `Twelve-Factor-App` and also `Specification by Example`.

## Introduction

This is how I will structure my REST API for node.js. It will be interesting to see how this architecture integrates with `graphql` and `falcor`.

This architecture is the answer to questions that I once asked myself :openmouth: like:

- How do I architecture a koajs app?
- How do I setup babel for ES7?
- How do I store my app configs for different environments?
- How do I split the routes for different services?
- How do I connect to the database?
- How do I carry out validations for request/response?
- How do I handle errors on the server side?
- How do I write reusable modules?
- How do I carry out testing for different endpoints?
- How do I integrate different clients (rabbitmq, redis)?
- How do I call one controller from another controller?
- How do I write mantainable codes?

> TL;DR I just want an architecture that is `mantainable`, `reproducible`, and `easy` to understand. It has to include `unit testing`, `functional approach` and each services can be `scaled independently` when necessary.

There are many different stack combination/different ways of solving the problem I mentioned. So I'll just stick to the one that works. :muscle:

### Get Started

Note: If you need to learn how to setup the server, check out 
[here](https://github.com/babel/example-node-server).

Start by creating a new `package.json` with the command `npm init`.

Then initialize a new git with the command `git init`.

We will be using the following npm modules to build our server.
```
// installing dependencies
$ npm install koa@2 --save

$ npm install koa-router@next --save

$ npm install koa-bodyparser@next --save
```

### Folder Structure
```
.
+-- common
|   +-- amqp.js
|   +-- config.js
|   +-- database.js
|   +-- redis.js
|   +-- toolbox.js
+-- modules
|   +-- base64.js
|   +-- code.js
|   +-- errors.js
|   +-- jwt.js
+-- public
+-- clientsvc
|   +-- sample
|       +-- error-400.md
|       +-- error-401.md
|       +-- error-403.md
|       +-- error-404.md
|       +-- error-500.md
|       +-- get-client-request.json
|       +-- get-client-response.json
|   +-- schema
|       +-- get-client-request.js
|       +-- get-client-response.js
|   +-- endpoint.js
|   +-- model.js
|   +-- schema.js
|   +-- service.js
|   +-- transport.js
+-- test
|   +-- clientsvc
|       +-- schema_test.js
|       +-- model_test.js
|       +-- service_test.js
+-- view
|   +-- _base.html
|   +-- index.html
+-- server.js
```


`Common` folder contains all the setups for the application, which includes third-party vendors (amqp, redis) and database.

`Modules` folder contains all the modules that will be published to NPM. I usually separate reusable modules and place publish it to NPM so that I can use it in other node.js apps. Once it is published, remove it from the folder.

`Public` folder contains static files.
`View` folder contains the view template.

`server.js` contains the application logic.

`clientsvc` is an example service folder. It contains the core business logic for a standalone service. You can choose to deploy and scale it independently (standalone server, database). The `sample` folder contains the json request/response in the `.json` or `.md` format (since some response can be a redirection and doesn't return a json response, we will write the example in the .md file) This is our living documentation and it stays in our source code. The `schema` folder contains the JSON-Schema validation for each services request/response object.


### Configs

Configs are stored as environment variables (*env vars*) in the `.env` file. Make sure you have installed node-foreman beforehand. For configs best practices, refer to the [Twelve-Factor-App](https://12factor.net/config).

```bash
// node-foreman installation
$ npm install -g foreman
```

Create an `.env` file with the following variables. We can add more later.

```
// .env
PORT=3000
MONGO_URI=mongodb://localhost/koa-oauth
```

Your environment variables can be accessed from your node.js program through `process.env.PORT`, `process.env.MONGO_URI`. ~~If you have a testing environment, you can store it in a `.env.test` file.~~ Don't do this, it defeats the purpose of storing configs in environment variables.

```javascript
// e.g. config.js

// NOTE: 
const PORT = process.env.PORT
const MONGO_URI = process.env.MONGO_URI

// required environment variables
[
  'MONGO_URI',
  'PORT'
].forEach((name) => {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} is missing`)
  }
})

// db.js
mongoose.connect(MONGO_URI)

// server.js
app.listen(PORT, (err) => {
  console.log(`listening to port *:${PORT}. press ctrl + c to cancel.`)
})
```

### Starting the Server

Create a `PROCFILE` with the following command. We will use `nodemon` which will watch the files for changes and automatically restarts the server so that the changes can be applied.
```
// PROCFILE
web: nodemon server.js
redis: redis-server start
mongo: mongod
```

You can start the server with the command `$ nf start`.
The environment variables will be loaded automatically from the `.env` file on runtime.

```terminal
$ nf start
```

You can specify which `.env` file or even load multiple `.env` file when starting the server.

```bash
// Loads both the .env and .envdev files
nf start -e .env,.envdev
```

### .gitignore

Create a `.gitignore` file. It should exclude the `node_modules` directory and `.env` file. This will prevent us from accidentally commiting sensitive information (password, configs etc) to Github.

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

## Service Folder

The following is a valid name for the service folder:

```
// ACCEPTED
clientsvc
client-service

// REJECTED
client_service
clientService
```

It's just a matter of preference, but I like to keep things standardized. The service folder will contain the following files/folders:

- __endpoint__ - The logic for handling the request/response at the specified endpoints
- __model__ - The core database model for the service. 
- __schema__ - The validation for the request/response of the service.
- __service__ - The core business rule. Accepts a defined input and produces a known output.
- __transport__ - The transport layers. Normally a router that handles that connects the endpoints to the routes.

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

Service is basically the core business logic of the application. It takes in an input (request) and produces and output (response). The response can then be consumed by the end users through different `transports` (e.g. REST, RPC).

Anything related to the request and response of a particular business rule should be placed in the service. Service should accept a set of know parameters, in which the validation will be carried out before passing in the request. It should also respond with a set of know responses, which is both predefined in the schema.

`Transport` an be a HTTP Server (REST), or RPC.

## Endpoint
The endpoint is where a service is called and the contracts are defined. Contracts are a predefined schema of request and response for the service. The contracts can be found in the `schema` folder for each corresponding services.

At the `schema` we define the following: 
- the type of response that will be returned (mostly object)
- `additonalProperties: true` means we do not accept any other fields than the ones defined
- `required` field is an array of fields that are mandatory for the request
- `properties` define the static type for each field and also custom validation (minLength, enum)
- `errorMessages` allow us to define custom error messages 


## Testing

Testing is carried out using mocha and also Postman.

The following naming for the test files are accepted: 
```
clientsvc_schema_test.js: Contains the test for the schema (request and response, error messages, validations)
clientsvc_endpoint_test.js: Contains the test for the endpoints
clientsvc_model_test.js: Contains the test for the model (statics, methods, validation)
clientsvc_service_test.js: Contains the test for the service (input, output)
clientsvc_transport_test.js: Test if the endpoint exists (status 200)
```

It should cover the following:

+ list of API URLs to test,
+ list of all params required in JSON request
+ list of mandatory params in JSON request
+ list of error/success codes and messages
+ it makes a cURL call for an API
+ validation on error codes and messages
+ writes Pass/Fail on a text or excel file
+ read input values for params in API requests from text or excel file
+ how many concurrent connections server can take before it fails
+ concurrent loads in batches like 25, 100, 200, 500 and so on
+ expected response time for all user loads
+ expected throughput for all user loads
+ expected qps - queries per second


#### svc_schema_test

The schema test should cover the following: 
+ required fields
+ accepted fields
+ validations
+ error messages
+ accepted request
+ accepted response
+ for strings, min/maxLength, null, empty string, defaults, pattern
+ for object, null, {}
+ for numbers, range, min, max, accepted, -1, 0, 1, pattern, default

#### svc_model_test

The model test should cover the following:
+ required fields
+ accepted fields
+ validations
+ error messages
+ response
+ static methods input/output
+ build in methods input/output

## Reference
1. http://connect2id.com/products/server/docs/api/authorization
2. https://docops.ca.com/ca-api-management-oauth-toolkit/3-6/en/openid-connect-implementation/open-id-connect-implementation-details
3. https://auth0.com/docs/api-auth/tutorials/authorization-code-grant-pkce
4. https://tools.ietf.org/html/rfc7636
5. http://connect2id.com/products/server/docs/api/token-introspection