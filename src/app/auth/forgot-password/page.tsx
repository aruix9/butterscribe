'use client'

import EmailField from '@/components/shared/form/emailField'
import Logo from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { handleForgotPasswordSubmit } from '@/lib/actions/handleAuthFormSubmits'
import { forgotPasswordSchema } from '@/schemas/zodAuthFormSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const ForgotPassword = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })
  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    handleForgotPasswordSubmit(values.email, router)
  }

  return (
    <main className='flex max-xl:flex-col grow'>
      <div className='2xl:w-1/2 xl:w-1/2 max-xl:items-center flex flex-col grow gap-4 justify-center px-16 bg-purple-50'>
        <Logo />
        <h2 className='text-4xl font-bold mt-4'>Forgot Password Title</h2>
        <p className='text-xl max-xl:text-center'>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit
          facilis quaerat possimus dolores voluptatibus repudiandae, molestias
          ut eligendi cum eos veritatis tempore dolorem corporis asperiores
          neque iste. Nulla, similique alias!
        </p>
      </div>

      <div className='2xl:w-1/2 xl:w-1/2 flex flex-col grow items-center justify-center'>
        <h2 className='text-3xl mb-6 font-[900]'>Forgot Password</h2>
        <p className='mb-4 max-w-88 text-center'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 bg-blue-50 p-8 rounded-lg w-sm'
          >
            <EmailField
              field={form.register('email')}
              error={form.formState.errors?.email}
            />
            <Button
              type='submit'
              size='lg'
              className='bg-primary text-blue-50 h-10 w-full cursor-pointer'
            >
              Submit
            </Button>
          </form>
        </Form>
        <p className='mb-4 max-w-88 text-center mt-4'>
          Remember the password?{' '}
          <Link
            href='/auth/signin'
            className='text-primary underline underline-offset-4'
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  )
}

export default ForgotPassword
