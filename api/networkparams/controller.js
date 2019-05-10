var model = require('./model');

const create = async(req, res, next) => {

  try{
      var response = (await model.create(req.body));

  }catch (e) {
      return res.status(400).json({message:e.toString()});
  }

  return res.status(201).json({message:"created"});
};

const get = async(req, res, next) =>{
  try{
      var response = (await model.get(req.query));
  }catch (e){
      return res.status(400).json({message: e.toString()});
  }
 return res.status(200).json({rows:response.rows});
};

const update = async (req, res, next) => {

  network = req.body.network;
  valid_from = req.body.valid_from;
  
  if(network && valid_from ) {
      return model.get({network: network, valid_from: valid_from}).then(result => {
          if (result && result.rows && result.rows[0]) {
              return model.update(req.body).then(Updated => {
                  return res.status(200).json({message: 'success.'});
              });
          } else return res.status(204).json({error: 'There is no data.'});
      }).catch(function(e){
          next(e);
      })
  } else {
    return res.status(400).json({error: 'Invalid data.'});
  }
};

const getAllNetworkparams = async(req, res, next) =>{

  try {
    var response = await model.getAllNetworkparams(req.query);
  }catch (e) {
      return res.status(400).json({message: e.toString()});
  }
  return res.status(200).json(response.rows);
};

exports.create = create;
exports.getAllNetworkparams = getAllNetworkparams;
exports.update = update;