import User from "./user.model.js";
import { checkPassword, encrypt } from "../../utils/encrypt.js";
import { join} from 'path'
import { unlink } from 'fs/promises'
import { serialize } from "v8";

const addAdmin = async () => {
    try {
        const defaultAdmin = await User.findOne({role: 'ADMIN'})
    if (!defaultAdmin) {
        const usuarioAdmin = new User({
                name: 'Jared',
                surname: 'Morataya',
                username: `${process.env.ADMIN_USER}`,
                email: `${process.env.ADMIN_EMAIL}`,
                password: await encrypt(`${process.env.ADMIN_PASSWORD}`),
                role: "ADMIN",
                date: Date.now,
                profilePicture: 'DefaultUser.png'
            })
            await usuarioAdmin.save()
            console.log('Default administrator added succesfully')
        }
    } catch (e) {
        console.error('General error', e)
    }
}
 
addAdmin()

export const addUser = async(req,res)=>{
    try {
        let data = req.body
        let user = new User(data)
        user.password = await encrypt(user.password)
        user.profilePicture = req.file.filename ?? null
        await user.save()
        return res.send({success:true,message:'User successfully added'})
    } catch (error) {
        console.log(error)
        return res.status(500).send({success:false,message:'General Error registerin the user'})
    }
}

export const getUsers = async(req,res)=>{
    try {
        const {limit = 20,skip=0} = req.query
        let users = await User.find().limit(limit).skip(skip)
        if(users.length === 0) return res.status(404).send({success:false,message:'Users not found'})
        return res.send({success:true,message:users})
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false,message:'General error listing the users'})
    }
}

export const getUser = async(req,res)=>{
    try {
        let {id} = req.params
        let user = await User.findById(id)
        if(!user) return res.status(404).send({success:false,message:'User not found'})
        return res.send({success:true,message:user})
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false,message:'General error searching the user'})        
    }
}

export const updateUser = async(req,res)=>{
    try {
        let {id}= req.params
        let data = req.body
        let user = await User.findByIdAndUpdate(id,{
            name:data.name,
            surname:data.surname,
            email:data.email,
            username:data.username,
            phone:data.phone,
            address:data.address
        },{new:true})
        if(!user) return res.status(404).send({success:false,message:'User not found'})
        return res.send({success:true,message:'User updated successfully'})
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false,message:'General error updating the user'})
    }
}

export const deleteUser = async(req,res)=>{
    try{
        let{id} = req.params
        let user = await User.findById(id)
        if(!user) return res.status(404).send({success:false,message: 'User not found'})
        await deleteUserPhotos(user.profilePicture,req.filePath)
        await User.findByIdAndDelete(id)
        return res.send({success:true,message:'User deleted successfully'})
    }catch(e){
        console.error(e)
        return res.status(500).send({success:false, message:'General error',e})
    }
}

export const deleteUserPhotos=async(file,filePath)=>{
    try {
        let rootPath = filePath
        const deletePath = join(rootPath,file)
        await unlink(deletePath)
    } catch (error) {
        console.log(error);
        throw new Error("Error deleting the images");
    }
}

export const updatePassword = async(req,res)=>{
    try{
        let {uid} = req.user
        let {newPassword,oldPassword} = req.body
        let user = await User.findById(uid)
        if(!user) return res.status(404).send({success: false,message: 'User not found'})
        let compare = await checkPassword(user.password, oldPassword)
        if(!compare) return res.status(401).send(
            {
                success:false,
                message: 'Old password is incorrect'
            }
        )
        user.password = await encrypt(newPassword)
        await user.save()

        return res.send(
            {
                success:true,
                message: 'Password updated successfully'
            }
        )
    }catch(e){
        console.error(e)
        return res.status(500).send({success:false,message: 'General error Changing the password'})
    }
}


export const changeProfilePicture = async(req,res,error)=>{
    try {
        if(req.file && req.filePath){
                
                const user = await User.findById(req.user.uid)
                const filePath = join(req.filePath, user.profilePicture)
                try{
                    console.log(filePath);
                    await unlink(filePath)
                    user.profilePicture = req.file.filename
                    await user.save()
                    return res.send({success:true,message:'Profile picture changed'})
                }catch(unlinkErr){
                    console.error('Error deleting file', unlinkErr)
                }
            }
            if(error.status === 400 || error.errors){ // === estricto | == abstracto
                return res.status(400).send(
                    {
                        success: false,
                        message: 'Error Changing the photo user',
                        error
                    }
                )
            }
            return res.status(500).send(
                {
                    success: false,
                    message: error.message
                }
            )
        
    } catch (error) {
        console.log(error)
        deleteFileOnError(error,req,res,'hi')
    }
 }

 export const findUsername = async(req,res)=>{
    try {
        
        let {username}=req.body
        console.log(req.body);
        
        let user = await User.findOne({username:username})
        
        if(user) return res.status(404).send({success:false,message:'This username already exist'})
        return res.send({success:true,message:'El Usuario no existe'})
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false,message:'General error searching the user'})
    }
 }

 export const findEmail = async(req,res)=>{
    try {
        let {email}=req.body
        console.log(req.body);
        
        let user = await User.findOne({email:email})
        
        if(user) return res.status(404).send({success:false,message:'This email already exist'})
        return res.send({success:true,message:'El Email no existe'})
    } catch (error) {
        console.log(error);
        return res.status(500).send({success:false,message:'General error searching the user'})
    }
 }