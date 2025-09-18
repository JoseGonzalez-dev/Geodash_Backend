import User from "./user.model.js";
import { checkPassword, encrypt } from "../../utils/encrypt.js";
import { join} from 'path'
import { unlink } from 'fs/promises'
import { serialize } from "v8";
import mongoose from "mongoose";

// Agregar esta nueva función al controlador existente (NO tocar las existentes)
export const migrateGuestToUser = async (req, res) => {
    try {
        const { guestId, email, username, password, name, surname } = req.body
        
        // Verificar que el usuario no exista
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        })
        
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: 'El email o username ya están en uso'
            })
        }
        
        // Crear nuevo usuario
        const newUser = await User.create({
            email,
            username,
            password,
            name,
            surname,
            role: 'CLIENT'
        })
        
        // Migrar partidas de invitado
        const guestGames = await Game.find({ guestId, isGuest: true })
        if (guestGames.length > 0) {
            await Game.updateMany(
                { guestId, isGuest: true },
                { 
                    user: newUser._id, 
                    isGuest: false, 
                    guestId: null,
                    maxQuestions: 510
                }
            )
        }
        
        // Migrar respuestas de invitado
        const guestAnswers = await UserAnswer.find({ 
            guestGameId: { $in: guestGames.map(g => g._id) },
            isGuest: true 
        })
        
        if (guestAnswers.length > 0) {
            await UserAnswer.updateMany(
                { 
                    guestGameId: { $in: guestGames.map(g => g._id) },
                    isGuest: true 
                },
                { 
                    game: { $set: guestGames.map(g => g._id) },
                    isGuest: false,
                    guestGameId: null
                }
            )
        }
        
        res.status(201).send({
            success: true,
            message: 'Usuario creado y progreso migrado correctamente',
            data: {
                user: newUser,
                migratedGames: guestGames.length,
                migratedAnswers: guestAnswers.length
            }
        })
        
    } catch (e) {
        res.status(500).send({
            success: false,
            message: 'Error al migrar invitado a usuario',
            error: e.message
        })
    }
}

const addAdmin = async () => {
    try {
        const defaultAdmin = await User.findOne({role: 'ADMIN'})
    if (!defaultAdmin) {
        const usuarioAdmin = new User({
                name: 'Jared',
                surname: 'Morataya',
                username: 'jmorataya',
                email: 'jmorataya@gmail.com',
                password: 'Jmorataya-123',
                role: "ADMIN",
                date: Date.now(),
            })
            await usuarioAdmin.save()
            console.log('Default administrator added succesfully')
        }
    } catch (e) {
        console.error('General error', e)
    }
}
 
// Ejecutar addAdmin después de que la conexión esté lista
mongoose.connection.once('open', () => {
    addAdmin()
})

export const addUser = async(req,res)=>{
    try {
        let data = req.body
        let user = new User(data)
        user.password = await encrypt(user.password)
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
        await User.findByIdAndDelete(id)
        return res.send({success:true,message:'User deleted successfully'})
    }catch(e){
        console.error(e)
        return res.status(500).send({success:false, message:'General error',e})
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