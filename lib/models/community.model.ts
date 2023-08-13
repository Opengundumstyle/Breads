import mongoose from 'mongoose'

const communitySchema = new mongoose.Schema({
      id:{type:String,required:true},
      username:{type:String,required:true,unique:true},
      name:{type:String,required:true},
      image:String,
      bio:String,
      createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
      },
      breads:[
        {  
           type:mongoose.Schema.Types.ObjectId,
           ref:'Bread'
        }
      ],
     members:[
        {
             type:mongoose.Schema.Types.ObjectId,
             ref:'User'
        }
         
    ],
      communities:[
          { 
            type:mongoose.Schema.Types.ObjectId,
            ref:"Community"
          }
      ]
})


const Community = mongoose.models.Community || mongoose.model('Community',communitySchema)


export default Community