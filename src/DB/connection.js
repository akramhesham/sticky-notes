import mongoose from 'mongoose';
import { DB_URL } from '../config/env.config.js';

export function connectDB(){
    mongoose.connect(DB_URL).then(()=>{
        console.log('DB connected successfuly');
    }).catch((err)=>{
        console.log(`error connecting to db because ${err}`)
    })
}
