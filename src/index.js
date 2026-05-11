import express from 'express';
import { connectDB } from './DB/connection.js';
import mongoose from 'mongoose';
import { usersRouter } from './modules/index.js';
import { SYS_MESSAGE } from './common/constant/message.constant.js';

const app=express();
const port=3000;
connectDB();
app.use(express.json());
app.use('/users',usersRouter);
app.use((err,req,res,next)=>{
    return res.status(err.cause||500).json({
        message:err.message,
        stack:err.stack,
        details:err.details?.length==0?undefined:err.details,
        success:false
    })
})
app.listen(port,()=>{
    console.log(`app is running on port ${port}`);
})
console.log(SYS_MESSAGE.users.alreadyExist)
