'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form } from '@/components/ui/form'
import NameField from '@/components/shared/form/nameField'
import EmailField from '@/components/shared/form/emailField'
import PasswordField from '@/components/shared/form/passwordField'
import { Button } from '@/components/ui/button'
import { signUpSchema } from '@/schemas/zodAuthFormSchemas'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { handleSignUpSubmit } from '@/lib/actions/handleAuthFormSubmits'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { ArrowRight, TrendingUp, Sparkles, Building2 } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect, Suspense } from 'react'

const SignUpFormContent = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [invitedCompany, setInvitedCompany] = useState<string | null>(null)
  const [invitationError, setInvitationError] = useState<string | null>(null)

  const router: AppRouterInstance = useRouter()
  const searchParams = useSearchParams()
  const inviteToken = searchParams.get('inviteToken') || undefined

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  // Validate invitation token on load
  useEffect(() => {
    if (inviteToken) {
      fetch(`/api/invitations/${inviteToken}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.isValid) {
            setInvitedCompany(data.company)
            if (data.email) {
              form.setValue('email', data.email)
            }
          } else {
            setInvitationError(data.message || 'Invalid or expired invitation token')
          }
        })
        .catch((err) => {
          console.error(err)
          setInvitationError('Failed to validate invitation token')
        })
    }
  }, [inviteToken, form])

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    handleSignUpSubmit(values, inviteToken)
  }

  return (
    <section className="max-w-[1440px] px-6 py-8 mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Marketing Content */}
        <div className="flex flex-col gap-8 order-2 lg:order-1">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-slate-900">
              Start Bridging Your <span className="text-primary">Authority Gap</span> Today
            </h1>
            <p className="text-lg text-slate-600 max-w-[500px] leading-relaxed">
              Unlock high-quality backlinks, perform deep competitive analysis, and access our exclusive SEO marketplace to dominate search results.
            </p>
          </div>

          <div className="relative mt-4">
            {/* Decorative Glassmorphic SEO Card */}
            <div className="backdrop-blur-xl bg-white/60 border border-white/40 p-6 rounded-xl shadow-2xl relative z-10 max-w-[400px]">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-primary">Authority Score</span>
                <span className="text-xs font-medium text-slate-500">Live Updates</span>
              </div>
              <div className="flex items-end gap-2 mb-8">
                <div className="w-full bg-primary/10 h-16 rounded-t-md relative overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-primary h-2/3 rounded-t-md"></div>
                </div>
                <div className="w-full bg-primary/10 h-24 rounded-t-md relative overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-primary h-3/4 rounded-t-md"></div>
                </div>
                <div className="w-full bg-primary/10 h-12 rounded-t-md relative overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-primary h-1/2 rounded-t-md"></div>
                </div>
                <div className="w-full bg-primary/10 h-20 rounded-t-md relative overflow-hidden">
                  <div className="absolute bottom-0 w-full bg-primary h-4/5 rounded-t-md"></div>
                </div>
              </div>
              <div className="flex items-center gap-4 border-t border-primary/10 pt-4">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">+24.5% Growth</p>
                  <p className="text-xs text-slate-500">Organic Visibility increase this month</p>
                </div>
              </div>
            </div>
            {/* Background blobs */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -bottom-8 right-12 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-0"></div>
          </div>

          <div className="flex gap-8 items-center text-slate-500">
            <div className="flex -space-x-3 overflow-hidden">
              <Image width="32" height="32" alt="Avatar of a male user" className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2uOl6p4QctgqC9VvjwWFMIdcGdFx1HjIAWa429ZuMT4KmoyHejeKkjXgqXVnosHx1E4L1t2gnllpsUHw1xSP-sf2zCBEK65WTWmAd__ebk-MgHy7Hdx9COyvvIV5H0KGkyEl_Oah_qTWDkBTOWE3Qu14521GPsXlrpZB-LqHMWjfWQAn1FFtOfTSfpm0yrvBcEMri-qqemFykB-bZNRTy2vbvq_yqbbcLucJtOhm_3SyUdQ5UdarxFYQNXMJVC7GnOaahKPkP-iZA" />
              <Image width="32" height="32" alt="Avatar of a female user" className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqxCMf2lY3V8M5o7_eiYEJrAt9xoe-OManZQ8Ke6sBMmhGkVewhDgIN_7hkutkNsX5owbDf44laJOSBV1YFrgLn7R-3CbjyneAVi8764cao6lEQ1RW-4W9PktJcjYwrJC8-2-d-9kP-zzuG2MvLqvIMVEQmNVUqrUCZyILlfD-IN-m9edK1mQolGq3T0xRJCUgMGDMVhftIAVTLCuyMziV7VpfWR-4wcZoVQJvXh0aiBL7yPlMBW3Fb7QEB-xd2o2yR_qZbBOsXjIA" />
              <Image width="32" height="32" alt="Avatar of a professional male" className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoB8jyo6hlxeVa6CusXWjL0kZthLpWlymVUwv2Oom_8mJFxL-v1gCxoGnnwukQM2uqwPK27HU-9alxoa0R8jeszBfe29wHqwl5hqzMRh9VZphIcjdo-CnLoPDyjYSGkADeBILL5rXnDLTOyiGN0URZt5rd8aFVgbXwhF8u3S6YBH88J1O0iGQbrntjXfgb_c4NUPdbsr65mYY_FoNFJLzVDuGpzUwMXLRPoeaCBqzeITt_84KBGdD-oEP66nh8zvaz9An_mkALoAon" />
            </div>
            <p className="text-sm font-medium italic">Joined by 2,000+ SEO experts</p>
          </div>
        </div>

        {/* Right Column: Sign-up Form */}
        <div className="order-1 lg:order-2">
          <div className="p-8 md:p-12 rounded-xl shadow-xl shadow-primary/5 border border-primary/10">
            <div className="mb-8">
              {invitedCompany ? (
                <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl text-purple-900">
                  <div className="flex items-center gap-2 font-bold text-sm text-purple-700 mb-1">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>Client Team Invitation</span>
                  </div>
                  <p className="text-xs text-purple-800">
                    You have been invited to join <strong className="font-bold text-purple-950">{invitedCompany}</strong>! Create your account below to automatically access their team workspace.
                  </p>
                </div>
              ) : invitationError ? (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold">
                  ⚠️ {invitationError}
                </div>
              ) : null}

              <h2 className="text-2xl font-bold text-slate-900 mb-2">Create your account</h2>
              <p className="text-slate-500 text-sm">
                {invitedCompany ? `Register your account to access ${invitedCompany}` : 'Get started with your 14-day free trial today.'}
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-5'
              >
                <NameField
                  field={form.register('name')}
                  error={form.formState.errors?.name}
                />
                <EmailField
                  field={form.register('email')}
                  error={form.formState.errors?.email}
                />
                <PasswordField
                  setShowPassword={setShowPassword}
                  showPassword={showPassword}
                  field={form.register('password')}
                  error={form.formState.errors?.password}
                />
                <div className="flex items-center gap-2 py-2">
                  <Checkbox id="terms" className="rounded text-primary data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  <Label htmlFor="terms" className="text-xs font-normal text-slate-500 leading-tight cursor-pointer">
                    I agree to the <Link href="#" className="text-primary font-semibold hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary font-semibold hover:underline">Privacy Policy</Link>.
                  </Label>
                </div>
                <Button
                  type='submit'
                  size='lg'
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl shadow-lg shadow-primary/30 transition-all flex items-center justify-center gap-2 group text-base"
                >
                  <span>{invitedCompany ? 'Accept & Register Account' : 'Get Started Now'}</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>
            </Form>

            <div className="mt-8 pt-8 border-t border-slate-200 text-center">
              <p className="text-slate-500 text-sm">
                Already have an account?{" "}
                <Link href="signin" className="text-primary font-bold hover:underline">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const SignUp = () => {
  return (
    <Suspense fallback={
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm font-semibold text-slate-500">Loading sign up form...</p>
      </div>
    }>
      <SignUpFormContent />
    </Suspense>
  )
}

export default SignUp
