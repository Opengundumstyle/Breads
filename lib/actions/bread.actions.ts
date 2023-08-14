'use server'

import { revalidatePath } from "next/cache"
import Bread from "../models/bread.model"
import User from "../models/user.model"
import Community from "../models/community.model"
import { connectToDB } from "../mongoose"

interface Params{
     text:string,
     author:string,
     communityId:string | null,
     path:string

}


export async function createBread({
      text,author,communityId,path
}:Params){

      try {
    connectToDB();


    const communityIdObject = await Community.findOne(
        {id:communityId},
        {_id:1}
    )

  
    const createdBread = await Bread.create({
      text,
      author,
      community:communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { breads: createdBread._id },
    });

    if(communityIdObject){
       await Community.findByIdAndUpdate(
         communityIdObject,{
           $push:{breads:createdBread._id}
         }
       )
    }


    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}


export async function fetchPosts(pageNumber = 1,pageSize = 20){
       connectToDB()

       // calculate the number of posts to skip
       const skipAmount = (pageNumber - 1) * pageSize;

       // fetch the posts that have no parents(Top-Level Breads)
       const postsQuery = Bread.find({parentId:{$in:[null,undefined]}})
       .sort({createdAt:'desc'})
       .skip(skipAmount)
       .limit(pageSize)
       .populate({path:'author',model:User})
       .populate({
         path:'children',
         populate:{
           path:'author',
           model:User,
           select:'_id name parentId image'
         }
       })

       const totalPostsCount = await Bread.countDocuments({parentId:{$in:[null,undefined]}})

       const posts  = await postsQuery.exec()

       const isNext = totalPostsCount > skipAmount + posts.length
   
       return {
         posts,
         isNext
       }

}


export async function fetchBreadById(id:string){

  connectToDB()
  try{

     // TODO:Populate Community
     const bread = await Bread.findById(id)
                              .populate({
                                 path:"author",
                                 model:User,
                                 select:"_id id name image"
                              })
                              .populate({
                                 path:'children',
                                 populate:[
                                   {
                                     path:'author',
                                     model:User,
                                     select:"_id id name parentId image"
                                   },
                                   {
                                     path:"children",
                                     model:Bread,
                                     populate:{
                                       path:"author",
                                       model:User,
                                       select:"_id id name parentId image"
                                     }
                                   }
                                 ]
                              }).exec()

                       return bread
                    
    
  }catch(error:any){
       throw new Error(`Error fetching bread:${error.message}`)
  }
   
}


export async function addCommentToBread(
     breadId:string,
     commentText:string,
     userId:string,
     path:string
     ){
     connectToDB()

     try {
        //adding a comment
        const originalBread = await Bread.findById(breadId)

        if(!originalBread){
           throw new Error("Thread not found")
        }

        const commentBread = new Bread({
             text:commentText,
             author:userId,
             parentId:breadId
        })

        //save new bread
        const savedCommentBread  = await commentBread.save()

        originalBread.children.push(savedCommentBread._id)

        // save original bread
        await originalBread.save()

        revalidatePath(path)

     } catch (error:any) {
      throw new Error(`Error fetching bread:${error.message}`)
       }


     }



