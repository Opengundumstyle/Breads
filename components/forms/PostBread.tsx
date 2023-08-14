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
import { BreadValidation } from '@/lib/validations/thread'
import { createBread } from '@/lib/actions/bread.actions'
import { useOrganization } from '@clerk/nextjs'


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
    const {organization} = useOrganization()

   const form = useForm({
     resolver:zodResolver(BreadValidation),
     defaultValues:{
        bread:'',
        accountId:userId}
     })


   const onSubmit =async (values:z.infer<typeof BreadValidation>) => {
      console.log('org id',organization)
      if(!organization){
        await createBread({
          text:values.bread,
          author:userId,
          communityId:null,
          path:pathname
       })
      }else{
        await createBread({
          text:values.bread,
          author:userId,
          communityId:organization.id,
          path:pathname
       })
      }
      
     
      router.push("/")
     
   }

     return (
      <Form {...form}>
      <form
        className='mt-10 flex flex-col justify-start gap-10'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name='bread'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='text-base-semibold text-light-2'>
                Content
              </FormLabel>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='bg-primary-500'>
          Post Bread
        </Button>
      </form>
    </Form>
     )
}

export default PostBread