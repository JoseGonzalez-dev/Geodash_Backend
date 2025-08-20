import User from "../src/User/user.model.js"
import Category from "../src/Category/category.model.js"

export const existsUser = async(username)=>{
    const alreadyExists = await User.findOne({username})
    if(alreadyExists){
        console.error(`The username ${username} is already taken`)
        throw new Error(`The username ${username} is already taken`)
    }
}
export const existsEmail = async(email)=>{
    const alreadyEmail = await User.findOne({email})
    if(alreadyEmail){
        console.error(`Email ${email} is already taken`)
        throw new Error(`Email ${email} is already taken`)
    }
}

export const existCategory=async(name,category)=>{
    const alreadyCategory=await Category.findOne({name})
    if(alreadyCategory && alreadyCategory._id !=category._id){
        console.error(`Category ${name} already exist`)
        throw new Error(`Category ${name} already exist`)
    }
}
