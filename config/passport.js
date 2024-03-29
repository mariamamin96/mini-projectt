var JwtStrategy= require('passport-jwt').Strategy;
var ExtractJwt= require('passport-jwt').ExtractJwt;

//var config= require('../config/database');

module.exports=function(passport){
  let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = 'secret';
  passport.use(new JwtStrategy(opts,(jwt_payload,done)=>{
    User.getUserById(jwt_payload._doc._id,(err,user)=>{
      if(err){
        return done(err,false);
      }
      if(user){
        return done(null,user);
      }else{
        return done(null,false);
      }
    });
}));
}
