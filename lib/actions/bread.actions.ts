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
      $push: { threads: createdBread._id },
    });

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}