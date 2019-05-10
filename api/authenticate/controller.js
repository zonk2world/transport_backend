const jwt = require("jsonwebtoken");
var config = require("../../config/database");
var user_model = require("../user/model");


const auth = async(req, res, next) => {

    if(!req.body.username || !req.body.password) return res.status(400).json({success: false, message: 'Username and password are required'});


    try{
        var result = (await user_model.getByUsername(req.body));
        if(!result || result.rowLength === 0) return res.status(400).json({success: 'false', message: 'User not found'});

        var user = JSON.parse(JSON.stringify(result.rows[0]));
        var check_password = ( await user_model.checkPassword(req.body, user));
        if(check_password && check_password.rowLength === 1){
            const token = jwt.sign(user, config.secret, {expiresIn: 604800});
            return res.status(200).json({
                success: true,
                token: token,
                user: {
                    uid: user.uid,
                    username : user.username,
                    role: user.role,
                    network: user.network,
                    name: user.name,
                    surname: user.surname
                }
            });

        }else {
            console.log("ok");
          return res.status(400).json({success: false, message: 'Login failed'});
        }

    }catch (e) {
        console.log(e.toString());
        return next(e);
    }
};

exports.auth = auth;
