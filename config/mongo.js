import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        mongoose.connection.on('error', ()=>{
            console.log('MongoDB | Could not be connect to mongodb')
        })
        mongoose.connection.on('connecting', ()=> {
            console.log('MongoDB | Try connecting')
        })
        mongoose.connection.on('connected', ()=> {
            console.log('MongoDB | Connected to mongodb')
        })
        mongoose.connection.once('open', ()=> {
            console.log('MongoDB | Connected to database')
        })
        mongoose.connection.on('reconnected', ()=> {
            console.log('MongoDB | Reconnected to mongodb')
        })
        mongoose.connection.on('disconnected', ()=> {
            console.log('MongoDB | Disconnected')
        })

        await mongoose.connect(
        process.env.MONGO_URI,
        {
            maxPoolSize: 50,
            serverSelectionTimeoutMS: 10000
        }
    )
    } catch (error) {
        console.log("Error al conectar a MongoDB", error)
        process.exit(1)
    }
}