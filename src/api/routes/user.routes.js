const express= require('express')
const users = require("../controllers/user.controller.js");
 const router= express.Router()

    // Register/Sign Up a new user
    router.post("/", users.create);
    //Login a user
    router.post("/login", users.login)
    //Logout a user
    router.get("/logout", users.logout)
    //Refresh a token
    router.get("/refresh", users.TokenRefresher)
    
module.exports= router    
  