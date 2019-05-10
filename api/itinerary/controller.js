var model = require('./model');

const get = async(req, res, next) =>{

    try {
        var response = await model.get(req.query);
    }catch (e) {
        return res.status(400).json({message: e.toString()});
    }
    return res.status(200).json(response.rows);
};

const update = async(req, res, next) =>{

  try {
      var response = await model.update(req.body);
  }catch (e) {
      return res.status(400).json({message: e.toString()});
  }
  return res.status(200).json({message: 'updated'});
};

const getByUser = async(req, res, next) =>{

    try {
        var response = await model.get(req.query);
        const id = req._user.id;
        var result;
        response.rows.forEach(function(object){
            object.employees.forEach(function(employee){
                if (employee.toString() === id) result = object;
            });
        });
    }catch (e) {
        return res.status(400).json({message: e.toString()});
    }
    if(result) return res.status(200).json(result);
    else return res.status(400).json({message:"No itinerary found for the current user"});
};

exports.get = get;
exports.update = update;
exports.getByUser = getByUser;