var model = require('./model');

const createRoutes = async(req, res, next) => {
    // console.log("BACK body")
    // console.log(req.body);
    titles = req.body.shift();
    routes = req.body;

    var promises = [];

    for(let route of routes){
        promises.push(model.createRoute(titles, route));
    }
    Promise.all(promises).then(function (result) {
        return res.status(201).json({message:"created"});
    }).catch(function(err){
        console.error(err);
        return res.status(400).json({message:err.toString()});
    });
};

/*
const createStopTimes = async(req, res, next) => {
    console.log("BACK body")
    console.log(req.body);
    titles = req.body.shift();
    stopTimes = req.body;

    var promises = [];

    for(let route of stopTimes){
        console.log('before prem');
        promises.push(model.update(titles, route));
        console.log('after prem');
    }
    Promise.all(promises).then(function (result) {
        return res.status(201).json({message:"created"});
    }).catch(function(err){
        console.error(err);
        return res.status(400).json({message:err.toString()});
    });
};
*/

const getStopIndices = async(req, res, next) => {
    // console.log(req.query);
    try {
        var response = await model.getStopIndices(req.query);
        // console.log(response);
    }catch (e) {
        next(e);
        return res.status(400).json({message: e.toString()});
    }
    return res.status(200).json(response.rows);
}

const getTimesByTripId = async(req, res, next) => {
    // console.log(req.query);
    try {
        var response = await model.getTimesByTripId(req.query);
        // console.log(response);
    }catch (e) {
        next(e);
        return res.status(400).json({message: e.toString()});
    }
    return res.status(200).json(response.rows);
}

exports.createRoutes = createRoutes;
exports.getStopIndices = getStopIndices;
exports.getTimesByTripId = getTimesByTripId;
