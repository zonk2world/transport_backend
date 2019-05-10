var client = require('../../helpers/cassandra_client');
var types = require('cassandra-driver').types;

const TABLE_NAME = "teams";
const VIEW_NAME = "teams_by_day";

var TeamPeriod = 
{
  CurrentlyActive : 0,
  ThisMonth : 1,
  Last6Days : 2
}

exports.create = function (values) {
  var query = "INSERT INTO " + TABLE_NAME + " (" +
      "uid, " +
      "name, " +
      "network, " +
      "day, " +
      "startdate, " +
      "enddate, " +
      "employees, " +
      "shift) " +
      "values(uuid(), ?, ?, ?, ?, ?, ?, ?)";
  var args = [
      values.name,
      values.network,
      values.day,
      values.startdate,
      values.enddate,
      values.employees,
      values.shift
  ];

  return client.execute(query, args, {prepare:true});
};

exports.get = function (values) {
    var query = "SELECT * FROM " + VIEW_NAME + " ";
    var fields = Object.keys(values);
    var args = [];
    var i = 0;
    if (values['period'] == null) {
      values['period'] = TeamPeriod.CurrentlyActive;
    }
    fields.forEach(x => {
      if (x === 'period') {
        i++;
        return;
      }
      if(x === 'day'){
        var date = new Date(values[x]);
        values[x] = types.LocalDate.fromDate(date);

        if (values['period'] === 'undefined') {
          query += x + " = ?";
          args.push(values[x]);
        } else {
          switch (parseInt(values['period'])) {
            case TeamPeriod.CurrentlyActive:
              query += x + " >= ? AND startdate <= ? AND enddate >= ?";
              args.push(values[x]);
              args.push(values[x]);
              args.push(values[x]);
            break;
            case TeamPeriod.ThisMonth:
  
              if (date.getMonth() == 11) {
                  var nextMonth = new Date(date.getFullYear() + 1, 0, 1);
              } else {
                  var nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
              }
  
              query += x + " >= ? AND ";
              args.push(types.LocalDate.fromDate(new Date(date.getFullYear(), date.getMonth(), 1)));
  
              query += x + " < ?";
              args.push(types.LocalDate.fromDate(nextMonth));
  
            break;
            case TeamPeriod.Last6Days:
            var last = date.setDate(date.getDate() - 60);
            query += x + " >= ? AND ";
            args.push(types.LocalDate.fromDate(new Date(last)));
            query += x + " <= ?";
            args.push(values[x]);
            break;
          }
        }
      }
      else {
        if(i == 0) query += "WHERE ";
        query += x + " = ?";
        args.push(values[x]);
      }

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
    "day = ?, " +
    "name = ?, " +
    "employees = ?, " +
    "shift = ? WHERE " +
    "network = ? AND " +
    "uid = ?";

    var args = [    
    body.day,
    body.name,
    body.employees,
    body.shift,
    body.network,
    body.uid
  ];
  return client.execute(query, args, {prepare:true});
};
