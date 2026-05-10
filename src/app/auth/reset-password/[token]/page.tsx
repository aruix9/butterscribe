'use client'

import PasswordField from '@/components/shared/form/passwordField'
import Logo from '@/components/shared/logo'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { handleResetPasswordSubmit } from '@/lib/actions/handleAuthFormSubmits'
import { resetPasswordSchema } from '@/schemas/zodAuthFormSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type ResetPasswordProps = {
  params: Promise<{
    token: string
  }>
}

const ResetPassword = ({ params }: ResetPasswordProps) => {
  const router = useRouter()
  const [token, setToken] = useState<{ token: string }>()

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await params
      setToken(response)
    }

    fetchProduct()
  }, [token, params])

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
    },
  })
  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    const { password } = values
    handleResetPasswordSubmit(password, token?.token, router)
  }

  return (
    <main className='flex max-xl:flex-col grow'>
      <div className='2xl:w-1/2 xl:w-1/2 max-xl:items-center flex flex-col grow gap-4 justify-center px-16 bg-purple-50'>
        <Logo />
        <h2 className='text-4xl font-bold mt-4'>Reset Password Title</h2>
        <p className='text-xl max-xl:text-center'>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Impedit
          facilis quaerat possimus dolores voluptatibus repudiandae, molestias
          ut eligendi cum eos veritatis tempore dolorem corporis asperiores
          neque iste. Nulla, similique alias!
        </p>
      </div>

      <div className='2xl:w-1/2 xl:w-1/2 flex flex-col grow items-center justify-center'>
        <h2 className='text-3xl mb-6 font-[900]'>Reset Password</h2>
        <p className='mb-4 max-w-88 text-center'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 bg-blue-50 p-8 rounded-lg w-sm'
          >
            <PasswordField
              field={form.register('password')}
              error={form.formState.errors?.password}
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

export default ResetPassword
