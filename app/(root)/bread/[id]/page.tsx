import BreadCard from "@/components/cards/BreadCard"
import { fetchBreadById } from "@/lib/actions/bread.actions"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import Comment from "@/components/forms/Comment"

const Page = async({params}:{params:{id:string}})=>{

    const user = await currentUser()
    if(!user) return null

    if(!params.id){
         return null
        }

    const userInfo = await fetchUser(user.id)
    if(!userInfo?.onboarded) redirect('/onboarding')

    const bread  = await fetchBreadById(params.id)
   


     return (<section className="relative">
        <div>
            <BreadCard 
                key={bread._id}
                id={bread._id}
                currentUserId={user?.id || ""}
                parentId={bread.parentId}
                content={bread.text}
                author={bread.author}
                community={bread.community}
                createdAt={bread.createdAt}
                comments = {bread.children}
            />
        </div>
        <div className="mt-7">
              <Comment
                breadId={bread.id}
                currentUserImg={userInfo.image}
                currentUserId={JSON.stringify(userInfo._id)}
               />
        </div>
        <div className="mt-11 ">
           {bread.children.map((childItem:any)=>(
                <BreadCard 
                    key={childItem._id}
                    id={childItem._id}
                    currentUserId={childItem?.id || ""}
                    parentId={childItem.parentId}
                    content={childItem.text}
                    author={childItem.author}
                    community={childItem.community}
                    createdAt={childItem.createdAt}
                    comments = {childItem.children}
                    isComment
            />
           ))}
        </div>
     </section>)
}

export default Page