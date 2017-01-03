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
