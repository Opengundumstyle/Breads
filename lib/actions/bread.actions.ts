'use server'

import { revalidatePath } from "next/cache"
import Bread from "../models/bread.model"
import User from "../models/user.model"
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

  
    const createdBread = await Bread.create({
      text,
      author,
      community:null, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { breads: createdBread._id },
    });

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