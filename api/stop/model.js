var client = require('../../helpers/cassandra_client');
var types = require('cassandra-driver').types;
const TABLE_NAME = "stops";

exports.create = function (values) {
        var stoppoint = values.uid;

        var query = "INSERT INTO " + TABLE_NAME + " (" +
            "uid, " +
            "coords, " +
            "stoppoint, "+
            "route, " +
            "name, " +
            "network) " +
            "values(?, ?, ?, ?, ?, ?)";
        const coords = new types.Tuple(parseFloat(values.latitude), parseFloat(values.longitude));

        var args = [
            values.uid,
            coords,
            stoppoint,
            values.route,
            values.name,
            values.network
        ];
        return client.execute(query, args, {prepare:true});
};

exports.get = function (values) {

    var query = "SELECT * FROM " + TABLE_NAME + " ";
    var fields = Object.keys(values);
    var args = [];
    var i = 0;
    fields.forEach(x => {
        if(i == 0) query += "WHERE ";
        query += x + " = ?";
        args.push(values[x]);
        i++;
        if(i < fields.length) query += " AND ";
    });
    const check = (query.match(/\?/g) || []).length;
    const check2 = (query.match(/id =/g) || []).length;
    if (!((check === 1 && check2 === 1) || (check == 0 && check2 === 0))) { query += " ALLOW FILTERING"; }

    return client.execute(query, args, {prepare: true});
};


exports.getStops = function (values) {
    var query = "SELECT * FROM " + TABLE_NAME + " ";
    query += "WHERE ";
    query += "network = ? ";
    query += "AND route = ? "
    query += "AND stoppoint = ? ";
    // query += values.replace(/"/g, "");
    query += " ALLOW FILTERING";

    var args = [
        values.network,
        values.route,
        values.stoppoint
    ];

    return client.execute(query, args, {prepare: true});
};