var client = require('../../helpers/cassandra_client');
var types = require('cassandra-driver').types;
const bcrypt = require('bcrypt-nodejs');
const config = require('../../config/database');
const TABLE_NAME = "routes";

exports.createRoute = function (titles, values) {
    var args = [];
    var idIdx;
    var query = "INSERT INTO " + TABLE_NAME + " (" +
        "uid, " +
        "network, " +
        "route_color, " +
        "route_text_color, ";

    titles.forEach((item, index) => {
        if (item !== 'route_id') {
            query += item + ', ';
        }
        else{
            idIdx = index;
        }
    });

    query = query.slice(0, -2);

    query += ') '

    query += "values(uuid(), 'TICE', 'blue', 'blue', ?, ?, ?)";

    values.forEach((item, index) => {
        if (index !== idIdx) {
            args.push(item);
        }
    });

    // console.log('query : ', query);
    // console.log('args', args);

    return client.execute(query, args, {prepare:true});
};

exports.getStopIndices = function(values){
    var args = [];
    var query = "SELECT stop_id, rank, trip_id, direction_id FROM times WHERE ";
    query += "network = ? ";
    query += "AND route_short_name = ? ";
    query += "AND direction_id = ?";

    args.push(values.network);
    args.push(values.route_short_name);
    args.push(values.dest);

    // console.log(query);

    return client.execute(query, args, {prepare: true});
};

exports.getTimesByTripId = function(values){
    var args = [];
    var query = "SELECT stop_id FROM times WHERE ";
    query += "network = ? ";
    query += "AND route_short_name = ? ";
    query += "AND trip_id = ? "
    query += "AND direction_id = ?";

    args.push(values.network);
    args.push(values.route_short_name);
    args.push(values.trip_id);
    args.push(values.direction_id);

    // console.log(query);

    return client.execute(query, args, {prepare: true});
};

