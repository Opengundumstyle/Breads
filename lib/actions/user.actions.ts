'use server'

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import Bread from "../models/bread.model"
import { connectToDB } from "../mongoose"
import { FilterQuery, SortOrder } from "mongoose"


interface Params{
     userId:string,
     username:string,
     name:string,
     bio:string,
     image:string,
     path:string
}


export async function updateUser(
        { 
            userId,
            username,
            name,
            bio,
            image,
            path
        }:Params
      ):Promise<void>{
    

     try {
        connectToDB( )
        await User.findOneAndUpdate(
            {id:userId},
            {
                username:username.toLowerCase(),
                name,
                bio,
                image,
                onboarded:true
            },
            {
                upsert:true
            }
            )
    
            if(path==='/profile/edit'){
                revalidatePath(path)
            }

        } catch (error:any) {
            throw new Error( `fail to create /update user:${error.message}`)
        }
}


export async function fetchUser(userId:string){
      try {
         connectToDB()

         return await User
                .findOne({id:userId})
                // .populate({
                //       path:'communities',
                //       model:Comminity
                // })
      } catch (error:any) {
            throw new Error(`Fail to fetch user:${error.message}`)
      }
}


export async function fetchUserPosts(userId:string){
     try {
        connectToDB()
        // find all breads author by the user with the given user id

        // TODO:populate community
        const breads = await User.findOne({id:userId}).populate({
              path:'breads',
              model:Bread,
              populate:{
                  path:'children',
                  model:Bread,
                  populate:{
                      path:'author',
                      model:User,
                      select:'name image id'
                  }
              }
              
        })
        return breads
     } catch (error:any) {
        throw new Error(`Fail to fetch user:${error.message}`)
     }
}



export async function fetchUsers({
       userId,
       searchString = "",
       pageNumber =1,
       pageSize = 20,
       sortBy="desc"
}:{
     userId:string;
     searchString?:string;
     pageNumber?:number;
     pageSize?:number;
     sortBy?:SortOrder;
}){
     try {
        connectToDB()

        const skipAmount  = (pageNumber - 1)* pageSize

        const regex = new RegExp(searchString,"i")

        const query:FilterQuery<typeof User> = {
             id:{$ne:userId}
        }

        if(searchString.trim()!==''){
             query.$or=[
                  {username:{$regex:regex}},
                  {name:{$regex:regex}}
             ]
        }

        const sortOptions ={createdAt:sortBy}


        const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize)


        const totalUsersCount = await User.countDocuments(query)

        const users = await usersQuery.exec()
        
        const isNext = totalUsersCount > skipAmount + users.length

        return {users,isNext}
        
     } catch (error:any) {
        throw new Error(`Fail to fetch user:${error.message}`)
     }
}




export async function getActivity(userId:string){
     try {
     
        connectToDB()
        // find all breads created by user 
         const userBreads = await Bread.find({author:userId})
        // collect all the child bread ids(replies) from the children field
         const childBreadIds = userBreads.reduce((acc,userBread)=>{
               return acc.concat(userBread.children)
         },[])
         const replies = await Bread.find({ 
              _id:{$in:childBreadIds},
              author:{$ne:userId},
         }).populate({
             path:'author',
             model:User,
             select:'name image _id'
         })

         return replies
         
     } catch (error:any) {
        throw new Error(`Fail to fetch user:${error.message}`)
     }
}