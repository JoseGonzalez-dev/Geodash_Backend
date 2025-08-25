import User from "../User/user.model.js";
import { checkPassword, encrypt } from "../../utils/encrypt.js";
import { generateJwt } from "../../utils/jwt.js";

export const register =async(req,res)=>{
    try {
        let data = req.body
        let newUser = new User(data)
        newUser.password =await encrypt(newUser.password)
        newUser.role = 'CLIENT'
        await newUser.save()
        return res.send({success:true,message:'User Registeres successfully'})
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false,message:'General Error registering'})
    }
}

export const login = async(req,res)=>{
    try {
        let {userLogin,password} = req.body
        let user = await User.findOne({$or:[{email:userLogin},{username:userLogin}]})
        if(!user) return res.status(400).send({success:false,message:'User not found'})
        if(user && await checkPassword(user.password,password)){
            let loggedUser ={
                uid:user._id,
                username: user.username,
                name: user.name,
                role: user.role,
            }
            let token = await generateJwt(loggedUser)
            return res.send({success:true,message:`Welcome user ${user.username}`,loggedUser,token})
        }
        return res.status(400).send({success:false,message:'Invalid Credentials'})
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false,message:'General error whit login'})
    }
}