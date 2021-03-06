// set up ========================
 var express  = require('express');
 var app      = express();                                // create our app w/ express
 var mongoose = require('mongoose');                      // mongoose for mongodb
 mongoose.Promise = require('bluebird');
 var morgan = require('morgan');                          // log requests to the console (express4)
 var bodyParser = require('body-parser');                 // pull information from HTML POST (express4)
 var methodOverride = require('method-override');         // simulate DELETE and PUT (express4)
 var Promise = require('bluebird');

 // configuration =================

 var a = mongoose.connect('mongodb://127.0.0.1:27017/todoTest');
 app.use(express.static(__dirname + '/todoList'));
 app.use(morgan('dev'));                                         // log every request to the console
 app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
 app.use(bodyParser.json());                                     // parse application/json
 app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
 app.use(methodOverride());

 // define model =================

 var todoInstanceModel = mongoose.model('todoInstance', {
   name : String,
   isDone : Boolean,
   listId : String
 });

 // application -------------------------------------------------------------
 app.get('/myTodo', function(req, res) {
     res.sendfile('./todoList/todo.html');
 });

 // listen (start app with node server.js) ======================================
 app.listen(8080);
 console.log('App listening on port 8080');


// api ---------------------------------------------------------------------

app.get('/api/todos', function(req, res) {
    todoInstanceModel.find({
    }).exec()
    .then((result) => {
      res.json(result);
    });
});

app.get('/api/todo/:listId', function(req, res) {
    todoInstanceModel.find({
      listId : req.params.listId
    }).exec()
    .then((result) => {
      res.json(result);
    });
});

app.post('/api/todo', function(req, res) {
  let list = JSON.parse(req.body.list);
  let promiseList = [];
  for(let i = 0; i < (list.length/3); i++){
    promiseList[i] = new Promise(function(resolve,reject){
      todoInstanceModel.update({
        name : list[i*3],
        listId : list[(i*3)+2]
      },{
        isDone : list[(i*3)+1]
      },{
        upsert : true
      },function(err){});
      resolve();
    });
  }
  Promise.all(promiseList).then(function(){
    todoInstanceModel.find({
      listId : list[2]
    }).exec()
    .then((result) => {
      res.json(result);
    });
  });
});

app.delete('/api/todos', function(req, res) {
  todoInstanceModel.remove({
  }).exec()
  .then(() => {
    return todoInstanceModel.find({}).exec();
  }).then((result) => {
    res.json(result);
  });
});

app.delete('/api/todo/:listId', function(req, res) {
    todoInstanceModel.remove({
        listId : req.params.listId
    }).exec()
    .then(() =>{
      return todoInstanceModel.find({}).exec();
    }).then((result) => {
      res.json(result);
    });
});
