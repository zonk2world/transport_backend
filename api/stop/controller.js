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

const getStops = async(req, res, next) =>{
    // ar promises = [];
    // console.log('id of stops backend');
    // console.log('body', req.body);
    // console.log('query', req.query);
    // console.log('uid ', req.query.uid);
    // let input = JSON.parse(req.query.uid);
    // console.log('input', input);

    try {
        var response = await model.getStops(req.query);
    }catch (e) {
        next(e);
        return res.status(400).json({message: e.toString()});
    }
    return res.status(200).json(response.rows);

    /*
    for(let id of input){
        console.log('id', id);
        promises.push(model.getStops(id));
    }
    Promise.all(promises).then(function (result) {
        console.log(result);
        return res.status(201).json({message:"created"});
    }).catch(function(err){
        console.error(err);
        return res.status(400).json({message:err.toString()});
    });
    */
};


exports.create = create;
exports.get = get;
exports.getStops = getStops;