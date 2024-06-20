import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema (
    {
        content:{
            type: String,
            required:true
        },
        video:{
            type: String,
            required:true
        },
        owner:{
            type: String,
            required:true
        }
    },
    {
        timestamps:true
    }
)
commentSchema.plugin(mongooseAggregatePaginate)
export const Comment = mongoose.model("Comment", commentSchema)