'use client'

import EmailField from '@/components/shared/form/emailField'
import PasswordField from '@/components/shared/form/passwordField'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { handleSignInSumit } from '@/lib/actions/handleAuthFormSubmits'
import { signInSchema } from '@/schemas/zodAuthFormSchemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import signInImage from '../../../../public/images/photo-1551288049-bebda4e38f71.jpeg'

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    handleSignInSumit(values)
  }

  return (
    <section className='max-w-[1440px] px-6 mx-auto py-8 w-full'>
      <div className='flex flex-col md:flex-row items-stretch gap-16'>
        {/* Left Column: Marketing Content */}
        <div className='flex-1 flex flex-col justify-center'>
          <div className='max-w-3xl'>
            <h1 className='text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight'>
              Welcome <span className='text-primary'>Back</span>
            </h1>
            <p className='text-lg text-slate-600 mb-10 leading-relaxed'>
              Bridging the authority gap with data-driven SEO strategies. Log in
              to manage your link-building campaigns and monitor your domain
              authority growth.
            </p>

            <div className='relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl shadow-primary/20 group'>
              <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10'></div>
              <Image
                fill
                alt='Analytics Dashboard'
                className='w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500'
                src={signInImage}
              />
              <div className='absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-lg z-20 border border-white/20'>
                <div className='flex items-center gap-3'>
                  <div className='w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white'>
                    <TrendingUp className='w-5 h-5' />
                  </div>
                  <div>
                    <p className='text-sm font-bold text-slate-900'>
                      +24% Domain Authority
                    </p>
                    <p className='text-xs text-slate-500'>
                      Average client growth this month
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sign-in Form */}
        <div className='flex-1 flex items-center justify-end'>
          <div className='w-full max-w-lg bg-background-light rounded-xl shadow-xl border border-slate-200 p-8 lg:p-10'>
            <div className='mb-8'>
              <h2 className='text-2xl font-bold text-slate-900 mb-2'>
                Sign In to Butterscribe
              </h2>
              <p className='text-slate-500'>
                Enter your credentials to access your account
              </p>
            </div>

            <Form {...form}>
              <form
                className='space-y-2'
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <EmailField
                  field={form.register('email')}
                  error={form.formState.errors?.email}
                />
                <div className='text-right text-sm text-primary underline underline-offset-4'>
                  <Link href='/auth/forgot-password'>Forgot Password</Link>
                </div>
                <PasswordField
                  setShowPassword={setShowPassword}
                  showPassword={showPassword}
                  field={form.register('password')}
                  error={form.formState.errors?.password}
                />

                <div className='flex items-center gap-2 my-6'>
                  <Checkbox
                    id='remember-me'
                    className='rounded text-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary'
                  />
                  <Label
                    htmlFor='remember-me'
                    className='text-sm font-normal text-slate-600 cursor-pointer'
                  >
                    Keep me signed in
                  </Label>
                </div>

                <Button
                  type='submit'
                  size='lg'
                  className='w-full h-[52px] bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] text-base'
                >
                  Sign In
                </Button>
              </form>
            </Form>
            <p className='mt-8 text-center text-sm text-slate-600'>
              New to Butterscribe?
              <Link
                href="signup"
                className='font-bold text-primary hover:underline ml-1'
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SignIn
