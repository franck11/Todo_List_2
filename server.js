// set up ========================
 var express  = require('express');
 var app      = express();                                // create our app w/ express
 var mongoose = require('mongoose');                      // mongoose for mongodb
 var morgan = require('morgan');                          // log requests to the console (express4)
 var bodyParser = require('body-parser');                 // pull information from HTML POST (express4)
 var methodOverride = require('method-override');         // simulate DELETE and PUT (express4)

 // configuration =================

 mongoose.connect('mongodb://127.0.0.1:27017/todoTest');
 app.use(express.static(__dirname + '/todoList'));
 app.use(morgan('dev'));                                         // log every request to the console
 app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
 app.use(bodyParser.json());                                     // parse application/json
 app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
 app.use(methodOverride());

 // define model =================
 var todoListModel = mongoose.model('todoList', {
   keyId : String
 });

 var todoInstanceModel = mongoose.model('todoInstance', {
   name : String,
   isDone : Boolean,
   listId : mongoose.Schema.ObjectId
 });

 // application -------------------------------------------------------------
 app.get('/myTodo', function(req, res) {
     res.sendfile('./todoList/todo.html');
 });

 // listen (start app with node server.js) ======================================
 app.listen(8080);
 console.log("App listening on port 8080");


// api ---------------------------------------------------------------------

app.get('/api/todoLists/all', function(req, res) {
    todoListModel.find(function(err, listOfInstances) {
        if (err){
          res.send(err);
        }
        res.json(listOfInstances);
    });
});

app.get('/api/todoLists/keyId/:keyId', function(req, res) {
    todoListModel.find({
      keyId : req.params.keyId
    }, function(err, listOfInstances) {
        if (err){
          res.send(err);
        }
        res.json(listOfInstances);
    });
});

app.post('/api/todoLists', function(req, res) {
    todoListModel.create({
       keyId : req.body.keyId,
    }, function(err, todo) {
        if (err){
            res.send(err);
        }
        todoListModel.find(function(err, listOfInstances) {
            if (err)
                res.send(err)
            res.json(listOfInstances);
        });
    });

});

app.delete('/api/todoLists/all', function(req, res) {
    todoListModel.remove({
    }, function(err, todo) {
        if (err){
            res.send(err);
        }
        todoListModel.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

app.delete('/api/todoLists/id/:instanceId', function(req, res) {
    todoListModel.remove({
        _id : req.params.instanceId
    }, function(err, todo) {
        if (err){
            res.send(err);
        }
        todoListModel.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

app.delete('/api/todoLists/keyId/:keyId', function(req, res) {
    todoListModel.remove({
        keyId : req.params.keyId
    }, function(err, todo) {
        if (err){
            res.send(err);
        }
        todoListModel.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

app.get('/api/todoInstances/all', function(req, res) {
    todoInstanceModel.find(function(err, listOfInstances) {
        if (err){
          res.send(err);
        }
        res.json(listOfInstances);
    });
});

app.get('/api/todoInstances/listId/:listId', function(req, res) {
    todoInstanceModel.find({
      listId : req.params.listId
    }, function(err, listOfInstances) {
        if (err){
          res.send(err);
        }
        res.json(listOfInstances);
    });
});

app.post('/api/todoInstances', function(req, res) {
    todoInstanceModel.create({
       name : req.body.name,
       isDone : req.body.isDone,
       listId : req.body.listId
    }, function(err, todo) {
        if (err){
          res.send(err);
        }
        todoInstanceModel.find(function(err, listOfInstances) {
            if (err)
                res.send(err)
            res.json(listOfInstances);
        });
    });
});

app.delete('/api/todoInstances/all', function(req, res) {
    todoInstanceModel.remove({
    }, function(err, todo) {
        if (err){
          res.send(err);
        }
        todoInstanceModel.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

app.delete('/api/todoInstances/id/:instanceId', function(req, res) {
    todoInstanceModel.remove({
        _id : req.params.instanceId
    }, function(err, todo) {
        if (err){
          res.send(err);
        }
        todoInstanceModel.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

app.delete('/api/todoInstances/listId/:listId', function(req, res) {
    todoInstanceModel.remove({
        listId : req.params.listId
    }, function(err, todo) {
        if (err){
          res.send(err);
        }
        todoInstanceModel.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

/*app.get('/api/todoInstance/withTodoListName/', function(req, res) {
    todoListModel.aggregate([{ $lookup: { from: 'todoList', localField: 'listId', foreignField: '_id', as: 'linkedListContent' } }])
    }, function(err, listOfInstances) {
        if (err){
          res.send(err);
        }
        res.json(listOfInstances);
    });
});*/
