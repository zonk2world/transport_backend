var client = require('../../helpers/cassandra_client');
var types = require('cassandra-driver').types;
const bcrypt = require('bcrypt-nodejs');
const config = require('../../config/database');
const TABLE_NAME = "employees";

exports.create = function (values) {
  const salt = config.secret;
  const hash = bcrypt.hashSync(values.password, salt);
  

        var query = "INSERT INTO " + TABLE_NAME + " (" +
            "uid, " +
            "network, " +
            "role, " +
            "name, " +
            "password, " +
            "phone, " +
            "surname, " +
            "username, " +
            "picture) " +
            "values(uuid(), ?, ?, ?, ?,?,?,?,?)";
        var args = [
            values.network,
            values.role,
            values.name,
            hash,
            values.phone,
            values.surname,
            values.username,
            values.picture
        ];
        return client.execute(query, args, {prepare:true});
};

exports.get = function (values) {
    var query = "SELECT uid, name, network, phone, picture, role, surname, username FROM " + TABLE_NAME + " ";
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

exports.update = function(body) {
  var updates = [];
  for(var field in body){
    if(field === 'password') body[field] = bcrypt.hashSync(body[field], config.secret);
    if(field != 'uid'){
      updates.push(client.execute('update employees set '+field+' = ? where uid = ?', [body[field], body.uid], { prepare : true }));
    }
  }
  return Promise.all(updates);
};

exports.delete = function(uid) {
    var query = "delete from employees where uid = ?";
    return client.execute(query, [uid]);
};
