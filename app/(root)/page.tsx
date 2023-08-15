
//app/page

import { fetchPosts } from "@/lib/actions/bread.actions"
import { currentUser } from "@clerk/nextjs"
import BreadCard from "@/components/cards/BreadCard"

export default async function Home() {

  const results  = await fetchPosts(1,30)
  const user = await currentUser()

  console.log('result',results.posts)

  return (
    <div>
       <h1 className="head-text text-left">Home</h1>
       <section className="mt-9 flex flex-col gap-10">
             {results.posts.length === 0?(
                <p className="no-result">No Breads Found</p>
             ):(
                <>
                  {
                     results.posts.map((post)=>
                       <BreadCard 
                          key={post._id}
                          id={post._id}
                          currentUserId={user?.id || ""}
                          parentId={post.parentId}
                          content={post.text}
                          author={post.author}
                          community={post.community}
                          createdAt={post.createdAt}
                          comments = {post.children}
                       />
                       )
                  }
                </>
             )}
       </section>
    </div>
  )
}
