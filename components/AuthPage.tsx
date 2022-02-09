import React, { useState } from 'react';
import { RadioGroup } from '@headlessui/react'
import { signIn, answerCustomChallenge, signUp } from "../lib"
import { InformationCircleIcon } from '@heroicons/react/solid'

enum AuthStatus {
  EMAIL = 'EMAIL',
  CODE = 'CODE'
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const AuthPage = () => {
  const [title, setTitle] = useState<string>("Sign in to your account")
  const [username, setUsername] = useState<string>("")
  const [confirmCode, setConfirmCode] = useState<string>("")
  const [status, setAuthStatus] = useState<string>(AuthStatus.EMAIL)
  const [errorMessage, setError] = useState<string | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)

  // handle email or phone number 
  const handleEmailOrPhoneNumber = async (event?: React.MouseEvent<HTMLElement>) => {
    event?.preventDefault()
    try {
      setLoading(true)
      // create a new account before signing in
      if (title == 'Create an account') {
        await signUp(username)
      }
      const user = await signIn(username)
      setAuthStatus(AuthStatus.CODE)
      setUsername(user)
      setLoading(false)
    } catch {
      setError("An error occured while handling your username.")
      setLoading(false)
    }
  }

  // handle authentication code
  const handleCode = async (event?: React.MouseEvent<HTMLElement>) => {
    event?.preventDefault()
    try {
      setLoading(true)
      await answerCustomChallenge(username, confirmCode)
      window.location.href = "/"
    } catch {
      setError("An error occured while handling your code.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-2xl font-extrabold text-gray-900">{title}</h2>
          <p className="mt-2  text-sm text-gray-600">
            This demo will show you how to implement passwordless flow with AWS Cognito. Ensure you deploy the backend before running the application. Go through the backend README.md on how to deploy the backend.
          </p>
        </div>
        <div>
          {AuthStatus.EMAIL == status && <RadioButtons setTitle={setTitle} />}
          {errorMessage && <div className="mt-3">
            <ErrorAlert errorMessage={errorMessage} />
          </div>}
          {AuthStatus.EMAIL == status && <EmailForm isLoading={isLoading} setUsername={setUsername} handleEmailOrPhoneNumber={handleEmailOrPhoneNumber} />}
          {AuthStatus.CODE == status && <CodeForm isLoading={isLoading} setConfirmCode={setConfirmCode} handleCode={handleCode} />}
        </div>
      </div>
    </div>
  )

}

export default AuthPage;

/**
 * ***********************************
 *          EMAIL FORM
 * ***********************************
*/
interface EmailFormProps {
  handleEmailOrPhoneNumber: () => Promise<void>
  setUsername: (event: string) => void
  isLoading: boolean
}
const EmailForm = ({ isLoading, setUsername, handleEmailOrPhoneNumber }: EmailFormProps) => {
  return (<form className="mt-4 space-y-4">
    <div className="rounded-md shadow-sm -space-y-px">
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="email_phone_number">
          Email address or Phone Number
        </label>
        <div className='mt-1'>
          <input
            id="email_phone_number"
            name="email_phone_number"
            type="email"
            onChange={(event) => { setUsername(event.target.value) }}
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder=""
          />
        </div>
        <div className="text-xs text-gray-400">Please provide the country prefix code, i.e., USA is +1 if you use a phone number.</div>
      </div>
    </div>

    <div>
      <button
        type="button"
        onClick={async () => {
          await handleEmailOrPhoneNumber()
        }}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isLoading ? <div className="animate-pulse">One moment...</div> : <div>Next</div>}
      </button>
    </div>
  </form>)
}

/**
 * ***********************************
 *          CODE FORM
 * ***********************************
*/
interface CodeFormProps {
  handleCode: () => Promise<void>
  setConfirmCode: (event: string) => void
  isLoading: boolean
}
const CodeForm = ({ handleCode, setConfirmCode, isLoading }: CodeFormProps) => {
  return (<form className="mt-4 space-y-4">
    <div className="rounded-md shadow-sm -space-y-px">
      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700" >
          Please enter the code sent to you.
        </label>
        <div className='mt-1'>
          <input
            id="code"
            name="code"
            type="text"
            onChange={(event) => { setConfirmCode(event.target.value) }}
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder=""
          />
        </div>
      </div>
    </div>

    <div>
      <button
        type="button"
        onClick={async () => {
          await handleCode()
        }}
        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isLoading ? <div className="animate-pulse">One moment...</div> : <div>Next</div>}
      </button>
    </div>
  </form>)
}

/**
 * ***********************************
 *          RADIO BUTTON
 * ***********************************
*/
interface RadionButtonsProps {
  setTitle: (event: string) => void
}
const RadioButtons = ({ setTitle }: RadionButtonsProps) => {
  const [selected, setSelected] = useState("LOGIN")
  return (
    <RadioGroup value={selected} onChange={(event) => {
      if (selected == 'LOGIN') {
        setTitle("Create an account")
        setSelected(event)
      } else {
        setTitle("Sign in to your account")
        setSelected(event)
      }

    }}>
      <div className="grid grid-cols-2 items-center space-x-2">
        <RadioGroup.Option
          value="LOGIN"
          className={({ checked, active }) =>
            classNames(
              checked ? 'border-transparent' : 'border-gray-300',
              active ? 'ring-2 ring-blue-500' : '',
              'relative block bg-white border rounded-lg shadow-sm px-4 py-2 cursor-pointer sm:flex sm:justify-between focus:outline-none'
            )
          }
        >
          {({ active, checked }) => (
            <>
              <div className="flex items-center">
                <div className="text-sm">
                  <RadioGroup.Label as="p" className="font-medium text-gray-900">
                    Login
                  </RadioGroup.Label>

                </div>
              </div>

              <div
                className={classNames(
                  active ? 'border' : 'border-2',
                  checked ? 'border-blue-500' : 'border-transparent',
                  'absolute -inset-px rounded-lg pointer-events-none'
                )}
                aria-hidden="true"
              />
            </>
          )}
        </RadioGroup.Option>
        <RadioGroup.Option
          value="CODE"
          className={({ checked, active }) =>
            classNames(
              checked ? 'border-transparent' : 'border-gray-300',
              active ? 'ring-2 ring-blue-500' : '',
              'relative block bg-white border rounded-lg shadow-sm px-4 py-2 cursor-pointer sm:flex sm:justify-between focus:outline-none'
            )
          }
        >
          {({ active, checked }) => (
            <>
              <div className="flex items-center">
                <div className="text-sm">
                  <RadioGroup.Label as="p" className="font-medium text-gray-900">
                    Register
                  </RadioGroup.Label>

                </div>
              </div>

              <div
                className={classNames(
                  active ? 'border' : 'border-2',
                  checked ? 'border-blue-500' : 'border-transparent',
                  'absolute -inset-px rounded-lg pointer-events-none'
                )}
                aria-hidden="true"
              />
            </>
          )}
        </RadioGroup.Option>
      </div>
    </RadioGroup>
  )
}


/**
 * ***********************************
 *          ERROR ALERT
 * ***********************************
*/
interface ErrorProps {
  errorMessage: string | null
}
const ErrorAlert = ({ errorMessage }: ErrorProps) => {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-red-700">{errorMessage}</p>
        </div>
      </div>
    </div>
  )
}
