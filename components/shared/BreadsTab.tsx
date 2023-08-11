import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import BreadCard from "../cards/BreadCard";

interface Props{
     currentUserId:string;
     accountId:string;
     accountType:string
}


const BreadsTab = async({currentUserId,accountId,accountType}:Props)=>{

  let result  = await fetchUserPosts(accountId)
  if(!result) redirect('/')

  console.log('what is result',result)

     return(
          <section className="mt-9 flex flex-col gap-10 ">
              {result.breads.map((bread:any)=> (
                <BreadCard 
                key={bread._id}
                id={bread._id}
                currentUserId={currentUserId}
                parentId={bread.parentId}
                content={bread.text}
                author={accountType==='User'?{name:result.name,image:result.image,id:result.id}:{
                      name:bread.author.name,image:bread.author.image,id:bread.author.id
                }}
                community={bread.community}
                createdAt={bread.createdAt}
                comments = {bread.children}
             />
              ))}
          </section>
     )
}

export default BreadsTab