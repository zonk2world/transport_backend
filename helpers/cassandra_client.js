var config = require('../config/database');
var cassandra = require('cassandra-driver');
var client = new cassandra.Client({
    contactPoints: ['127.0.0.1'], // TODO/INFO contact points is list of the nodes address, if it fails to connect to the first node, try the next...
    keyspace: config.keyspace,
    encoding: { useUndefinedAsUnset: false }
});
client.connect(function(err, result){
    console.log('Cassandra connected');
});

module.exports = client;
