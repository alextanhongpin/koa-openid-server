# OAuth Server example using Koa and KoaRouter

##WORK IN PROGRESS

Note: If you need to learn how to setup the server, check out 
[https://github.com/babel/example-node-server](here).

###Folder Structure
+ common - contains all the common configuration/database/loggers etc.
+ view - contains the HTML templates and partial views


Install all the necessary dependencies.
```
npm install koa@2 --save

npm install koa-router@next --save

npm install koa-bodyparser@next --save

```
Start by creating a new `package.json` with the command `npm init`.
Then initialize a new git with the command `git init`.

### Environment Variables

We will store our environment variables in the `.env` file. Make sure you have installed node-foreman `npm install -g foreman`.
```
// .env
PORT=3000
MONGO_URI=mongodb://localhost/koa-oauth
```
Your environment variables can be accessed from your node.js program through `process.env.PORT`, `process.env.MONGO_URI`.

### Starting the Server

Create a `PROCFILE` with the following command. When you invoke the command `nf start`, the server will be initialized with the environment variables from the `.env` file. At the same time, it will call `nodemon` to watch your files for changes and automatically restarts the server.
```
// PROCFILE
web: nodemon server.js
```

### .gitignore

Create a `.gitignore` file. It should exclude the `node_modules` directory and `.env` file. This will prevent us from accidentally commiting sensitive information to Github.

```
// .gitignore
node_modules
.env
```

If you have accidentally committed the node_modules directory, follow the following steps to remove them:
```
git rm -r --cached node_modules
git commit -m 'Remove the now ignored directory node_modules'
git push origin master
```
