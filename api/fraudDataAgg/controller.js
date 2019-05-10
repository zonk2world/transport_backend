const model = require('./model');
const password_generator = require('password-generator');
const email_validator = require('../../helpers/email_validator');
const email_sender = require('../../helpers/email_sender');

const get = async(req, res, next) => {
    try {
        var response = await model.get(req.query);
    }catch (e) {
      next(e);
        return res.status(400).json({message: e.toString()});
    }
    return res.status(200).json(response.rows);
};

const post = async(req, res, next) => {
    try {
        var response = (await model.create(req.body));
    } catch (e) {
        next(e);
        return res.status(400).json({message:e.toString()});
    }

    return res.status(201).json({message:"Fraud data created"});
};

exports.getFraudDataAgg = get;
exports.postFraudDataAgg = post;