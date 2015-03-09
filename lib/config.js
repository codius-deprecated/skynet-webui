var nconf = require('nconf');
var dotenv = require('dotenv');

dotenv.load();

nconf.use('memory');
nconf.env();

module.exports = nconf;
