var client = require('../../helpers/cassandra_client');
var localDate = require("cassandra-driver").types.LocalDate;
const TABLE_NAME = "routes";


exports.getLines = function (values) {
    // console.log("get Lines :", values);
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

exports.getStopIdsByLineName = function (values) {
    // console.log("stop ids by line name :", JSON.stringify(values, null, 4));
    var query = "SELECT stop_list FROM " + TABLE_NAME + " ";
    var args = [];
        query += "WHERE ";
        query += "route_short_name = ?";
        query += " AND ";
        query += "route_long_name = ? ";
        query += "ALLOW FILTERING";

        args.push(values.route_short_name);
        args.push(values.route_long_name);
        // console.log('GET STOP IDS', query);
        // console.log(args);
    return client.execute(query, args, {prepare: true});
};

exports.addLine = function (values) {
    // console.log("add Line :", values);
    var type;

    switch(values.route_type){
      case "tramway": {
        type = 0;
      }
      case "metro": {
        type = 1;
      }
      case "train": {
        type = 2;
      }
      case "bus": {
        type = 3;
      }
      case "ferry": {
        type = 4;
      }
      case "cable car on rail": {
        type = 5;
      }
      case "cable car": {
        type = 6;
      }
      case "funicular": {
        type = 7;
      }
    }



    var query = "INSERT INTO " + TABLE_NAME + " (" +
          "uid, " +
          "route_short_name, " +
          "route_color, " +
          "route_long_name, " +
          "route_text_color, " +
          "route_type, " +
          "network, " +
          "stop_list " +
          ") " +
          "values(uuid(), ?, ?, ?, ?, ?, ?, ?)";

          var args = [
            values.route_short_name,
            values.route_color,
            values.route_long_name,
            values.route_text_color,
            type,
            values.network,
              values.stop_list
          ];

    return client.execute(query, args, {prepare: true});
};

exports.updateStopIds = function (values) {
    var listStopPoints = [];
    console.log('values ', values);
    values.stop_points.forEach(val => {
        listStopPoints.push(val.stop_id);
    });
    console.log('listStopPoints: ', listStopPoints);
    var query = " UPDATE " + TABLE_NAME + " SET stop_list = ? WHERE "
    query += "network = ? "
    query += "AND route_short_name = ?"
    var args = [
        listStopPoints,
        values.network,
        values.route_short_name
    ];

    return client.execute(query, args, {prepare: true});
}

exports.getLineByShortName = function (values) {
    var query = "SELECT * FROM " + TABLE_NAME + " WHERE ";
    query += "network = ? ";
    query += "AND route_short_name = ?";
    var args = [
        values.network,
        values.route_short_name
    ];

    return client.execute(query, args, {prepare: true});
}
