var model = require('./model');
const password_generator = require('password-generator');
const email_validator = require('../../helpers/email_validator');
const email_sender = require('../../helpers/email_sender');


const create = async(req, res, next) => {
    //
    // try{
    //     var response = (await model.create(req.body));
    //
    // }catch (e) {
    //     return res.status(400).json({message:e.toString()});
    // }
    //
    // return res.status(201).json({message:"created"});

    var username = req.body.username;
    if(username && email_validator.validate(username)){
        return model.get({username: username}).then(result =>{
            if(result && result.rows && result.rows[0]){
                return res.status(400).json({message: 'Username already exists'});
            }else{
                req.body.password = password_generator(12, false);
                return model.create(req.body).then(result =>{
                    email_sender.welcome(req.body);
                    return res.status(201).json({message: 'created'});
                }).catch(err =>{
                    return res.status(400).json({message: err.message});
                });
            }
        }).catch(err =>{
            return res.status(400).json({message: err.message});
        });

    }else if(!username) return res.status(400).json({message: 'Username is required'});
    else return res.status(400).json({message:'Username is not valid'});
};

const get = async(req, res, next) =>{
    try{
        console.log("req query :", req.query);
        console.log("req body :", req.body);
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
    if(uid) {
        return model.get(req.query).then(result => {
            if (result && result.rowLength > 0) {
            return model.delete(uid).then(deleted => {
                return res.status(202).json({message: 'success.'});
        });
      } else {
        return res.status(202).json({error: 'Invalid data.'});
      }
    });
    }
    else return res.status(400).json({error: 'Invalid parameters.'});
};

const profile = async(req, res, next) =>{

  var user = req._user;
  var response = new Object();

  if (user) {
    for (var key in user) {
      if (key != 'password') {
        response[key] = user[key];
      }
    }
  }

  return res.status(200).json(response);
};

exports.create = create;
exports.get = get;
exports.update = update;
exports.del = del;
exports.profile = profile;
