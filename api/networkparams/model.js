var client = require('../../helpers/cassandra_client');
var localDate = require("cassandra-driver").types.LocalDate;
const TABLE_NAME = "network_params";

exports.create = function (values) {

  var query = "INSERT INTO " + TABLE_NAME + " (" +
      "network, " +
      "valid_from, " +
      "shifts) " +
      "values(?, ?, ?)";

  var args = [
      values.network,
      values.valid_from,
      values.shifts
  ];

  return client.execute(query, args, {prepare:true});
};

exports.getAllNetworkparams = function (values) {

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

  query += " ORDER BY valid_from DESC LIMIT 1";
  
   const check = (query.match(/\?/g) || []).length;
   const check2 = (query.match(/id =/g) || []).length;
   if (!((check === 1 && check2 === 1) || (check == 0 && check2 === 0))) { query += " ALLOW FILTERING"; }

   return client.execute(query, args, {prepare: true});

};

exports.update = function (body) {
  var query = "UPDATE " + TABLE_NAME + " SET " +
    "shifts = ? WHERE " + 
    "network = ? AND " + 
    "valid_from = ?";

  var args = [
    body.shifts,
    body.network,
    body.valid_from
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