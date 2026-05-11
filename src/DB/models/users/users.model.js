import { model, Schema } from "mongoose";

const schema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:[18,'age must be bigger than 18 years old'],
        max:[60,'age must be less than 60 years old']
    }
})

export const Users=new model("Users",schema);