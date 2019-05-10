const express = require('express');
const logger = require("morgan");
const body_parser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const path = require('path');

const authenticate = require("./api/authenticate/route");
const user = require("./api/user/route");
const stop = require("./api/stop/route");
const team = require("./api/team/route");
const itinerary = require('./api/itinerary/route');
const line = require('./api/line/route');
const employee = require('./api/employee/route');
const upload = require('./api/upload/route');
const networkparams = require('./api/networkparams/route');
const blacklist = require('./api/blacklist/route');
const fileUpload = require('./api/fileUpload/route');
const fraudDataAgg = require('./api/fraudDataAgg/route');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
require("./config/passport")(passport);

app.use('/api/auth', authenticate);
app.use('/api/users', user);
app.use('/api/stops', stop);
app.use('/api/upload', upload);
app.use('/api/teams', team);
app.use('/api/itinerary', itinerary);
app.use('/api/line', line);
app.use('/api/employee', employee);
app.use('/api/networkparams', networkparams);
app.use('/api/fileUpload', fileUpload);
app.use('/api/blacklist', blacklist);
app.use('/api/fileUpload', fileUpload);
app.use('/api/fraudDataAgg', fraudDataAgg);

module.exports = app;
