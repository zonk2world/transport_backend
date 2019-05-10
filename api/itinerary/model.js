var client = require('../../helpers/cassandra_client');
var localDate = require("cassandra-driver").types.LocalDate;
const TABLE_NAME = "itineraries";

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

exports.update = function (body) {
  var query = "UPDATE " + TABLE_NAME + " SET " +
    // "chunks = ?, " +
    "network = ?, " +
    "team = ? WHERE " + 
    "month = ? AND " +
    "day = ? AND " +
    "shift = ?";

  var args = [
    // body.chunks,
    body.network,
    body.team,
    body.month,
    body.day,
    body.shift
  ];
  return client.execute(query, args, {prepare:true});
};