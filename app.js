var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var router = express.Router();

var routes = require ('./routes');
var passport=require('passport');
var mongojs = require('mongojs');
var db= mongojs("studentport",['accounts']);
var mongoose = require('mongoose');
var projectController = require('./controllers/projectController');

//var config=require('./config/database');
var cors=require('cors');
var DB_URI = "mongodb://localhost:27017/studentport";
var app = express();

mongoose.connect(DB_URI);
var UserSchema =mongoose.Schema({

  name:{
    type: String
  },
  email:{
    type:String,
    required: true
  },
  password:{
    type: String,
    required:true
  },
	work:{
		type: String,
		requires:true
	}
});
var Userdb= module.exports=mongoose.model('User',UserSchema);
var projectSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    URL:String
})



//var userdb = mongoose.model('User', userSchema);

app.use('/' , routes);
//app.use('/users',User);

app.use(cors());
app.use(router);


//View engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));



//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

//Set Static Path
app.use(express.static(path.join(__dirname, 'public')));


//Global Vars
app.use(function (req,res,next) {
		res.locals.errors = null;
		next();
});

//Express Validator Middleware

app.get('/',function (req,res,next) {
	res.render('index');
});

app.get('/getUser/:id',function(req,res){
  console.log('getting user');
  var Id = req.params.id;
  Userdb.find({ _id : Id }, function(err, users) {
    if (err) throw err;
    user = users[0];
    res.send(user);
  });
});

app.post('/addWork/:id',function(req,res){
  console.log('adding')
  var Id = req.params.id;
  work = req.body;

  Userdb.findById(Id, function(err, user) {

           if (err)
               res.send(err);

            console.log(work);
           user.works += "*"+work.work;
           console.log(user.works);

           // save the bear
           user.save(function(err) {
               if (err)
                   res.send(err);

              console.log('User Updated');
							res.render('profile');
           });

       });
});




app.post('/register',(req, res) =>{
  var newUser = Userdb({
    name: req.body.name,
    email: req.body.email,
    password: req.body.psw,
		work: req.body.yourwork
  });


  newUser.save(function(err) {
      if (err) throw err;
      console.log('User created!');
    });
  res.render('login');
});

/*app.post('/login', function(req, res,next){
	res.render('profile');
});*/

app.post('/login',function(req,res,next){
  var uname = req.body.email;
  var pw = req.body.psw;


Userdb.find({ email: uname }, function(err, users) {
  if (err) throw err;

  if(users.length>=1 && users[0].password == pw)
  {
    console.log('password correct');
    res.redirect('profile/'+users[0]._id);
  }
  else{
    console.log('password incorrect');
    res.render('incorrect-password');
  }
});



});

app.get('/profile/:id',function(req,res){
  res.render('profile')
});



app.post('/student', function(req, res,next){
	res.render('login');
});
/*app.post('/visitor' , function(req , res){
	res.render('visitor');
	console.log("visitinngg");
})*/
app.post('/signup', function(req, res){
	res.render('signup');
});
app.get('/profile', function(req, res){
	res.send('Profile');
});




app.get('/',function (req,res,next) {
	res.render('index');
});


app.post('/tryAgain'  , function(req , res){
	res.render('login');

})
app.post('/home'  , function(req , res){
	res.render('index');

})
app.get('/home'  , function(req , res){
	res.render('index');

})

app.post('/student', function(req, res,next){
	res.render('login');
});
router.post('/visitor',projectController.getAllProjects);

app.post('/signup', function(req, res){
	res.render('signup');
});




app.get('/getAllWork', function(req,res){


  Userdb.find(function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });



});

module.exports=projectController;
module.exports = router ;

app.listen(3000, function(){
	console.log('Server Started on Port 3000...');

})
