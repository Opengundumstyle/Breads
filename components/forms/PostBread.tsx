'use client'

import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'


import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { z } from 'zod';
import { usePathname,useRouter } from 'next/navigation';

// import { updateUser } from '@/lib/actions/user.actions';
import { BreadValidation } from '@/lib/validations/thread'
import { createBread } from '@/lib/actions/bread.actions'


interface Props{
     user:{
         id:string;
         objectId:string;
         username:string;
         name:string;
         bio:string;
         image:string;
     };
     btnTitle:string
}




function PostBread({userId}:{userId:string}){

    const router = useRouter()
    const pathname = usePathname()

   const form = useForm({
     resolver:zodResolver(BreadValidation),
     defaultValues:{
        bread:'',
        accountId:userId}
     })


   const onSubmit =async (values:z.infer<typeof BreadValidation>) => {
      
      await createBread({
         text:values.bread,
         author:userId,
         communityId:null,
         path:pathname

      })

      router.push("/")
     
   }

     return (
        <Form {...form}>
             <form onSubmit={form.handleSubmit(onSubmit)} 
                className="flex flex-col justify-start gap-10 text-white mt-10">
            </form>


            <FormField
                control={form.control}
                name="bread"
                render={({ field }) => (
                    <FormItem className='flex flex-col gap-3 w-full'>
                    <FormLabel className ='text-base-semibold text-white'>
                          Content
                    </FormLabel>
                    <FormControl>
                        <Textarea
                           rows={15}
                           className='no-focus border border-dark-4 bg-dark-3 text-light-1'
                           {...field}
                        />
                    </FormControl>
                    <FormMessage/>
                    </FormItem>
                )}
                />
                <Button type="submit" className='bg-primary-500 mt-4 w-full'>
                          Post Bread
                </Button>
        </Form>
     )
}

export default PostBread