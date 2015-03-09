var express = require('express');
var github = require('./lib/github');
var Browser = require('./lib/commit-browser');
var TestnetManager = require('./lib/testnet-manager');
var bodyParser = require('body-parser');
var Guid = require('guid');
var redis = require('redis');

var app = express();

var browser = new Browser(github);
var testnets = new TestnetManager();

app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  browser.getCommits().then(function(commits) {
    console.log("Got commits:");
    console.log(commits);
    res.render('index', {
      commits: commits
    });
  });
});

app.get('/launch/:sha', function(req, res) {
  testnets.getNetworks().then(function(testnets) {
    browser.getCommit(req.params.sha).then(function(commit) {
      res.render('launch', {
        commit: commit,
        testnets: testnets
      });
    });
  });
});

app.post('/launch', function(req, res) {
  var sha = req.body.sha;
  var node_count = req.body.node_count;
  var playbook = req.body.playbook;
  var guid = Guid.create();
  console.log("Deploying %d node testnet with SHA %s, and playbook %s: %s",
      node_count,
      sha,
      playbook,
      guid.value);
  redis.saddAsync('testnets', guid.value).then(function() {
    res.render('monitor', {
      deploy_id: guid.value
    });
  });
});

app.listen(app.get('port'), function() {
  console.log('testnet ui is running at localhost:' + app.get('port'));
});
