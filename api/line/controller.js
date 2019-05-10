var model = require('./model');
var modelStops = require('../stop/model');
const uuidv4 = require('uuid/v4');


const getLines = async(req, res, next) =>{

    try {
        var response = await model.getLines(req.query);
    }catch (e) {
      next(e);
        return res.status(400).json({message: e.toString()});
    }
    return res.status(200).json(response.rows);
};

const addLine = async(req, res, next) => {
    var promises = [];

    var stoplist = [];

    for(let stop of req.body.stops){
        let uid = uuidv4();
        stop["uid"] = uid;
        stoplist.push(uid.toString());
       promises.push(modelStops.create(stop));
    }
    req.body["stop_list"] = stoplist;
    promises.push(model.addLine(req.body));
    Promise.all(promises).then(function (result) {
        // console.log('result ', result);
        return res.status(201).json({message:"created"});
    }).catch(function(err){
        // console.error(err);
        return res.status(400).json({message:err.toString()});
    });
};

const getStopIdsByLineName = async(req, res, next) => {
    // console.log(req.query);
    try {
        var response = await model.getStopIdsByLineName(req.query);
    }catch (e) {
        next(e);
        return res.status(400).json({message: e.toString()});
    }
    return res.status(200).json(response.rows);
}

const updateStopIds = async(req, res, next) => {
    var promises = [];
    var stoplist = [];

    console.log('updateStopIds query : ', req.body);
    for(let obj of req.body){
       promises.push(model.updateStopIds(obj));
    }
    Promise.all(promises).then(function (result) {
        console.log('result ', result);
        return res.status(201).json({message:"created"});
    }).catch(function(err){
        console.error(err);
        return res.status(400).json({message:err.toString()});
    });
};

const getLineByShortName = async(req, res, next) => {
    console.log('query', req.query);
    console.log('body', req.body);
    try {
        var response = await model.getLineByShortName(req.query);
    }catch (e) {
      next(e);
        return res.status(400).json({message: e.toString()});
    }
    return res.status(200).json(response.rows);
};

exports.getLines = getLines;
exports.addLine = addLine;
exports.getStopIdsByLineName = getStopIdsByLineName;
exports.updateStopIds = updateStopIds;
exports.getLineByShortName = getLineByShortName;
