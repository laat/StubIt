var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    glob = require('glob'),
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
    res.status(process.env.NOT_FOUND_STATUS || 404).end();
    return;
  }

  if(action.responseHeaders) {
    res.set(action.responseHeaders);
  }
  if (action.status) {
    res.status(action.status);
  }
  if (action.responseBody) {
    if(action.responseHeaders && action.responseHeaders['Content-Type']) {
      res.send(action.responseBody);
    }else {
      res.json(action.responseBody);
    }
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


var pattern = process.env.TEST_FILER || "testdata/**/*.json";
glob(pattern, function(err, files) {
  if (err) throw err;
  files.forEach(function(file) {
    console.log("loading file: " + file);
    var fileObject = JSON.parse(fs.readFileSync(file, 'utf8'));
    store.leggTilTestdata(fileObject);
  });
});

var applicationPort = process.env.APPLICATION_PORT || 8081;
console.log("starting StubIt on port ", applicationPort);

var httpServer = http.createServer(app);
httpServer.listen(applicationPort);
