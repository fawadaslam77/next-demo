'use client';

import { lusitana } from '@/app/ui/font';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from './button';
import { signIn } from 'next-auth/react';
import { FormEvent, SyntheticEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import axios from 'axios';
import { date } from 'zod';

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [pending, setPending] = useState(false)
  // const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  // const { pending } = useFormStatus()
  const [errorMessage, setLoginError] = useState('')

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget
    setFormData((prevVal) => ({
      ...prevVal,
      [name]: value
    }))
    // setFormError({ ...formError, [name]: "" });
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault()
    console.log(process.env.NEXTAUTH_SECRET)
    try {
      const { email, password, } = formData
      const response: any = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      console.log(response)
      if (response?.error && response?.error === "CredentialsSignin") {
        setLoginError('Invalid credentials')
      } else if (response?.error) {
        setLoginError(response.error)
      }
      if (!response?.error) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      console.log(error)
      setLoginError(error.response.statusText)
    }
  }

  const testApi = async () => {
    try {
      const res = await axios.get('/api/user', { headers: { "Accept": "application-json" } })
      console.log(res)
    } catch (error) {

    }
  }

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                value={formData.email}
                onChange={handleChange}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                value={formData.password}
                onChange={handleChange}
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* <LoginButton /> */}
        <Button className="mt-4 w-full" disabled={pending ? true : false}>
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
        </Button>

        <br></br>
        <Button type='button' onClick={testApi}>Test</Button>
        <div className="flex h-8 items-end space-x-1">
          {/* Add form errors here */}
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
      </div>
    </form>

  );
}

// function LoginButton() {
//   const { pending } = useFormStatus()
//   return (
//     <Button className="mt-4 w-full" disabled={pending ? true : false}>
//       Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
//     </Button>
//   );
// }
