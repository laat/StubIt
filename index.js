var http = require('http'),
    url = require('url'),
    ActionStore = require('./actionstore.js'),
    bodyParser = require('body-parser'),
    express = require('express');

var app = express();
app.use(bodyParser.json());
app.use(require('morgan')('dev'));

store = new ActionStore();

app.get("/testdata", function(req, res) {
  res.json(store.store);
});

app.post("/testdata", function(req, res) {
  store.leggTilTestdata(req.body);
  res.status(200).end();
});


var processAction = function(res, action) {
  if (!action) {
    res.status(404).end();
    return;
  }
  if (action.status) {
    res.status(action.status);
  }
  if (action.value) {
    res.json(action.value);
  }
  res.end();
};

app.get(/\/(.*)/, function(req, res) {
  var path = url.parse(req.url).path;
  var action = store.getAction(path, 'GET');
  processAction(res, action);
});


app.post(/\/(.*)/, function(req, res) {
  var path = url.parse(req.url).path;
  var action = store.getAction(path, 'POST', req.body);
  processAction(res, action);
});

app.put(/\/(.*)/, function(req, res) {
  var path = url.parse(req.url).path;
  var action = store.getAction(path, 'PUT', req.body);
  processAction(res, action);
});

console.log("starter mock server");

var httpServer = http.createServer(app);
httpServer.listen(8081);
