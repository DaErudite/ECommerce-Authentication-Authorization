const jwt = require('jsonwebtoken')

const authorize = (req, res, next) => {
    try {
      const authorizer = req.header('Authorization')
  
      if (!authorizer) {
        return res.status(401).json({
          success: false,
          msg: 'Access denied! Sign in',
        });
      }
  
      const token = authorizer.split(' ')[1];
      console.log(token)
      // verify token
        const verified = jwt.verify(token, process.env.ACCESS_JWT_SECRET);
       req.user = verified;
      next();
    } catch (error) {
      return res.status(403).json({
        success: false,
        msg: 'Access denied! Sign in',
      }); 
    }
  };

  module.exports= authorize
  