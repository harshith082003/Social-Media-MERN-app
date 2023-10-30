const express = require('express');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');
const cookieParser = require('cookie-parser')
const app = express();

if(process.nextTick.NODE_ENV !== 'production'){
    require('dotenv').config({path: 'config/config.env'});
}

// Using Middlewares
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//Using Routes 
app.get('/', (req, res) => {
    res.send("Yen samachara?");
});

app.use("/api/v1", postRouter);
app.use("/api/v1", userRouter);

module.exports = app;