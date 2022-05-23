const mongoose= require('mongoose');

require('dotenv').config();

const dbConnect = (app)=>{
const Private_Key=process.env.dbURI
mongoose.connect(Private_Key,{ useNewUrlParser: true, useUnifiedTopology: true  })
.then((result)=> app.listen(3000))
.catch((error)=> console.log('mongoose error occurred'));

}

module.exports= {dbConnect}