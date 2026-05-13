import { model, Schema, SchemaTypes } from "mongoose";

const schema = new Schema({
    title: {
        type: String,
        required: true,
        lowercase: true
    },
    content: {
        type: String,
        required: true
    },
    userId: {
        type: SchemaTypes.ObjectId,
        ref: "Users",
        required: true
    }
}, {
    timestamps: true
})

export const Notes = new model("Notes", schema);