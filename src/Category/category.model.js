import { Schema,model } from "mongoose";

const categorySchema=Schema(
    {
        name:{
            type:String,
            maxLength:[50,`Can't be overcome 50 characters`],
            unique:true,
            required:true
        },
        description:{
            type:String,
            maxLength:[250,`Can't be overcome 150 characters`]
        }
    }
)

categorySchema.methods.toJSON=function(){
    const { __v,...category}= this.toObject()
    return category
}

export default model('Category',categorySchema)