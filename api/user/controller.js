const password_generator = require('password-generator');
var user_model = require('../user/model');
const email_validator = require('../../helpers/email_validator');
const email_sender = require('../../helpers/email_sender');


const create = (req, res, next) => {

    var username = req.body.username;
    if(username && email_validator.validate(username)){
        return user_model.getByUsername({username: username}).then(result =>{
            if(result && result.rows && result.rows[0]){
                return res.status(400).json({message: 'Username already exists'});
            }else{
                req.body.password = password_generator(12, false);
                return user_model.create(req.body).then(result =>{
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

const get = (req, res, next) =>{



};



exports.create = create;
