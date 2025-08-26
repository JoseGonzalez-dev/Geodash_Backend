import User from "../User/user.model.js";
import { checkPassword, encrypt } from "../../utils/encrypt.js";
import { generateJwt } from "../../utils/jwt.js";

// Agregar esta nueva función al controlador existente (NO tocar las existentes)
export const loginWithGuestMigration = async (req, res) => {
    try {
        const { email, password, guestId } = req.body
        
        // Login normal (usar la lógica existente)
        const user = await User.findOne({ email })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({
                success: false,
                message: 'Credenciales inválidas'
            })
        }
        
        // Si hay guestId, migrar progreso
        if (guestId) {
            const guestGames = await Game.find({ guestId, isGuest: true })
            
            if (guestGames.length > 0) {
                // Migrar partidas
                await Game.updateMany(
                    { guestId, isGuest: true },
                    { 
                        user: user._id, 
                        isGuest: false, 
                        guestId: null,
                        maxQuestions: 510
                    }
                )
                
                // Migrar respuestas
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
        }
        
        // Generar JWT (usar la lógica existente)
        const token = jwt.sign(
            { uid: user._id, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: '24h' }
        )
        
        res.status(200).send({
            success: true,
            message: 'Login exitoso',
            data: {
                user: {
                    uid: user._id,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    username: user.username,
                    role: user.role
                },
                token,
                guestMigration: guestId ? {
                    migratedGames: guestGames.length,
                    migratedAnswers: guestGames.length * 5
                } : null
            }
        })
        
    } catch (e) {
        res.status(500).send({
            success: false,
            message: 'Error en el login',
            error: e.message
        })
    }
}

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