var client = require('../../helpers/cassandra_client');
var types = require('cassandra-driver').types;
const config = require('../../config/database');
const TABLE_NAME = "blacklist";
const VIEW_NAME = "blacklist_by_ts";

exports.create = function (values) {

  var query = "INSERT INTO " + TABLE_NAME + " (" +
      "uid, " +
      "network, " +
      "name, " +
      "stoppoint, " +
      "ts, " +
      "line, " +
      "station, " +
      "reportdate, " +
      "description) " +
      "values(uuid(), ?, ?, ?, ?, ?, ?, ?, ?)";

  var reportdate = types.LocalDate.fromDate(new Date(values.reportdate));
  var ts = new Date(values.ts).getTime();

  var args = [
      values.network,
      values.name,
      values.stoppoint,
      ts,
      values.line,
      values.station,
      reportdate,
      values.description
  ];

  return client.execute(query, args, {prepare:true});
};

exports.get = function (values) {

    var query = "SELECT * FROM " + VIEW_NAME + " WHERE network =? AND ts > ? AND ts < ?";
    var args = [
      values.network,
      values.from,
      values.to,
    ]
    const check = (query.match(/\?/g) || []).length;
    const check2 = (query.match(/id =/g) || []).length;
    if (!((check === 1 && check2 === 1) || (check == 0 && check2 === 0))) { query += " ALLOW FILTERING"; }

    return client.execute(query, args, {prepare: true});
};

exports.update = function(body) {
  var updates = [];
  // for(var field in body){
  //   if(field === 'password') body[field] = bcrypt.hashSync(body[field], config.secret);
  //   if(field != 'uid'){
  //     updates.push(client.execute('update employees set '+field+' = ? where uid = ?', [body[field], body.uid], { prepare : true }));
  //   }
  // }
  return Promise.all(updates);
};

exports.delete = function(uid, network) {
    var query = "delete from blacklist where uid = ? and network = ?";
    return client.execute(query, [uid, network]);
};
