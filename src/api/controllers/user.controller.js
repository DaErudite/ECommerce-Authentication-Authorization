require('dotenv').config()
const User = require('../models/User.js')
const jwt=require('jsonwebtoken')
const { userValidation,  loginValidation } = require ('../validations/user.validation.js');
const bcrypt= require('bcrypt')






// Create a new user
exports.create= async(req,res)=>{
    try{

    const { error } = userValidation(req.body);
    if (error){
      return res.status(400).json({
        msg: error.details[0].message,
      });
    }


    let { firstName, lastName, email, password, confirmPassword } = req.body;

    User.findOne({ email: req.body.email }, (err,user)=>{
    if (user) {
        console.log(user)
       return res.status(400).json({
           msg:"email already exists"})
        }
    })
    
  

    const Salt=12
    password = await bcrypt.hash(password, Salt);         
    const user = new User({ firstName, lastName, email, password});

// Save user in the database
const savedUser = await user.save();
    if (savedUser) {
      const { password, ...newUser } = savedUser._doc;

      return res.status(201).json({
        msg: 'new user account created',
        success: true,
        user: newUser,
      });
    }
}
catch(err) {
    res.status(500).send({
        message: err.message || "Error occurred."
        });
    };

};


//login a previously created user
exports.login = async(req, res) => {
    try{
      const { error } = loginValidation(req.body); 
      if (error)
        return res
          .status(400)
          .json({ success: false, msg: 'Check login details and try again' });
  
      const { email, password } = req.body;
      console.log({email,password})
      const user = await User.findOne({ email }).select('+password');
      if (!user)
        return res
          .status(400)
          .json({ success: false, msg: 'Invalid credentials' });
  
      // compare password with hashed password
      const validPassword =await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res
          .status(400)
          .json({ success: false, msg: 'Invalid credentialsss' });
  
      // create an access token
     const accessToken= jwt.sign({ id: user._id, role:"ADMIN" },  process.env.ACCESS_JWT_SECRET, {expiresIn: '15m'})


     //create a refresh token   
     const refreshToken= jwt.sign({ id: user._id, role:"ADMIN" },  process.env.REFRESH_JWT_SECRET, {expiresIn: '1d'})

        user.refreshToken= refreshToken
        await user.save()

        res.cookie('jwt', refreshToken, {
            httpOnly:true,
             maxAge: 24*60*60*1000,
             sameSite:'None',
             secure:true
        })

        return res.status(200).json({msg:"Login successful", accessToken}) 
    } catch (error) {
       console.log(error.message);
       return res.status(400).json({
         msg: 'Login failed',
         success: false
       });
     }
  };
  




exports.logout = (req, res) => {
    return res
      .clearCookie('jwt')
      .status(200)
      .json({ success: true, msg: 'Log out successful' });
  };



// Refresh Token
exports.TokenRefresher = async(req, res) => {
    try{
      const cookie =req.cookies;
      if (!cookie?.jwt) {
        return res.status(401).json({
          success: false,
          msg: 'Access denied! Log in/Sign in',
        });
      }
      const refreshToken= cookie.jwt
      console.log(cookie)
      //check for user in db
      const user = await User.findOne({ refreshToken });
      if (!user)
        return res
          .status(401)
          .json({ success: false, msg: 'Sign/Log In first' });

     // if user exists
    jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET, (err,decoded)=>{
         if (err || user._id != decoded.id){
            console.log(decoded.id)
             return res.status(403).json({msg:'Error occured'})
                         
         } 

         //create access token
        const accessToken= jwt.sign({ id: user._id, role:"ADMIN" },  process.env.ACCESS_JWT_SECRET, {expiresIn: '15m'})

  
        return res.status(200).json({accessToken}) 
     })
  
    
    } catch (error) {
       console.log(error.message);
       return res.status(400).json({
         msg: 'Login failed',
         success: false
       });
     }
  };
