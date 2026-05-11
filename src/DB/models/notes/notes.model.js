import { model, SchemaTypes } from "mongoose";

const schema=new Schema({
    title:{
        type:String,
        required:true,
        lowerCase:true
    },
    content:{
        type:String,
        required:true
    },
    userId:{
        type:SchemaTypes.ObjectId,
        ref:"Users",
        required:true
    },
    timestamps:true
})

export const Notes=new model("Notes",schema);