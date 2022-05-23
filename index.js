require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const {dbConnect}= require('./src/config/database')
const productRoutes=require('./src/api/routes/product.routes.js')
const userRoutes=require('./src/api/routes/user.routes.js')
const CookieParser=require('cookie-parser')


// create express app
const app = express();

//connect database
dbConnect(app);

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(CookieParser())


app.get('/',(req,res)=>{
    res.redirect('/products');
})

app.use('/' , productRoutes)

app.use('/api/users', userRoutes)


