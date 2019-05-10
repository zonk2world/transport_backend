var model = require('./model');

const get = async(req, res, next) =>{
    try{
        var response = (await model.get(req.query));
    }catch (e){
      next(e);
        return res.status(400).json({message: e.toString()});
    }
   return res.status(200).json({rows:response.rows});
};

const create = async(req, res, next) => {

    try{
        var response = (await model.create(req.body));

    }catch (e) {
      next(e);
        return res.status(400).json({message:e.toString()});
    }

    return res.status(201).json({message:"created"});
};

const put = async(req, res, next) => {

  try{
      var response = (await model.update(req.body));

  }catch (e) {
    next(e);
      return res.status(400).json({message:e.toString()});
  }

  return res.status(200).json({message:"updated"});
};

exports.create = create;
exports.get = get;
exports.put = put;
