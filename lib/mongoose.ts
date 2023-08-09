import mongoose from 'mongoose'
import moongoose from 'mongoose'

let isConnected = false

export const connectToDB = async()=>{
     moongoose.set('strictQuery',true)

     if(!process.env.MONGODB_URL) return console.log('MONGODB not found')

     if(isConnected) return console.log('Already connected to MongoDB')


     try {
        await mongoose.connect(process.env.MONGODB_URL)

        isConnected = true
        console.log('connected to MongoDB')
     } catch (error) {
        console.log(error)
     }

} 