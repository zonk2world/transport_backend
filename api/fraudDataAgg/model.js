const client = require('../../helpers/cassandra_client');
const localDate = require("cassandra-driver").types.LocalDate;
const TABLE_NAME = "fraud_data_agg";

exports.create = (values) => {
    
    let query = "INSERT INTO " + TABLE_NAME + " (" +
                "network, " +
                "uid, " +
                "pv_avg, " +
                "pv_var, " + 
                "timeslot)" +
                "values( ?, ?, ?, ?)";
    let fields = Object.keys(values);
    let args = [
        values.network,
        values.uid,
        values.pv_avg,
        values.pv_var,
        values.timeslot
    ];
    
    return client.execute(query, args, {prepare:true});

};

exports.get = (values) =>{
    let query = "SELECT * FROM " + TABLE_NAME + " ";
    let fields = Object.keys(values);
    let args = [];
    let i = 0;

    fields.forEach(x => {
        if (i == 0 ) query += "WHERE ";

        query += x + " = ?";
        args.push(values[x]);
        i++;
        if (i < fields.length) query += " AND ";
    });

    const check = (query.match(/\?/g) || []).length;
    const check2 = (query.match(/id =/g) || []).length;
    if (!((check === 1 && check2 === 1) || (check == 0 && check2 === 0))) { query += " ALLOW FILTERING"; }

    return client.execute(query, args, {prepare:true});
};


