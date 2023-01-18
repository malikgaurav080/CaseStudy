const express=require('express');
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');
const dotenv = require("dotenv");


dotenv.config();


const router=require('./Routes/Userrouter')
const app=express();

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }))


app.use(express.json());
app.use('/user',router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get('/',(req,res)=>{
    res.send("WelCOME TO USER API CASESTUDY");
})

const port = process.env.PORT;

mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    app.listen(port, ()=>{
        console.log("Server started on port no. " + port);
    });
})
.catch((error)=>{
    console.log(error);
})
