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
    uid = req.body.uid;
    if(uid) {
        return model.get({uid: uid}).then(result => {
            if (result && result.rows && result.rows[0]) {
                return model.update(req.body).then(Updated => {
                    return res.status(202).json({message: 'success.'});
                });
            } else return res.status(202).json({error: 'Invalid rule data.'});
        }).catch(function(e){
            next(e);
        })
    }
};

const del = async (req, res, next) => {
    uid = req.query.uid;
    network = req.query.network;
    if(uid && network) {
        return model.get(req.query).then(result => {
            if (result && result.rowLength > 0) {
            return model.delete(uid, network).then(deleted => {
                return res.status(202).json({message: 'success.'});
        });
      } else {
        return res.status(202).json({error: 'Invalid data.'});
      }
    });
    }
    else return res.status(400).json({error: 'Invalid parameters.'});
};

exports.create = create;
exports.get = get;
exports.update = update;
exports.del = del;