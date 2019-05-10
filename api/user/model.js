const bcrypt = require('bcrypt-nodejs');
var client = require('../../helpers/cassandra_client');
const config = require('../../config/database');
const TABLE_NAME = 'employees';

exports.create = function (values) {

    const salt = config.secret;
    const hash = bcrypt.hashSync(values.password, salt);

    var query = "INSERT INTO " + TABLE_NAME + " (" +
        "id, " +
        "name, " +
        "surname, " +
        "role, " +
        "username, " +
        "password " +
        ") values (uuid(), ?, ?, ?, ?, ?)";


    var args = [

        values.name,
        values.surname,
        values.role,
        values.username,
        hash
    ];

    return client.execute(query, args, {prepare: true});
};

exports.get = function (values) {

    var query = "SELECT * FROM " + TABLE_NAME;
    var fields = Object.values(values);
    var args = [];
    var i = 0;

    fields.forEach(x => {

        if(i == 0) query += " WHERE ";
        query += x + " = ? ";
        args.push(values[x]);
        i++;
        if(i < fields.length) query += " AND ";

    });

    const check = (query.match(/\?/g) || []).length;
    const check2 = (query.match(/id =/g) || []).length;
    if (!((check == 1 && check2 == 1) || (check == 0 && check2 == 0))) { query += " ALLOW FILTERING"; }

    return client.execute(query, args, {prepare: true});

};


exports.getByUsername= function(body) {

    const username = body.username;
    var query = "SELECT * FROM " + TABLE_NAME  + " WHERE username = ? ALLOW FILTERING";
    return client.execute(query, [username]);
};

exports.checkPassword = function (values, user) {

    var username = user.username;
    var query = "SELECT * FROM " + TABLE_NAME + " WHERE username = ? AND password = ? ALLOW FILTERING";
    var hash = bcrypt.hashSync(values.password, config.secret);

    return client.execute(query, [username, hash], {prepare: true});
};
