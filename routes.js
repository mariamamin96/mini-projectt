var express = require('express');
var router = express.Router();
//var Project = require('./controllers/projectController');
var passport=require('passport');
var jwt=require('jsonwebtoken');
var path = require('path');
//var config= require('../config/database');
var routes = require ('./routes');
var app = express();



module.exports = router ;
