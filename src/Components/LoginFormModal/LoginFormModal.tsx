import { LockClosedIcon } from '@heroicons/react/solid';
import axios from 'axios';
import { useState } from 'react';
import { z } from 'zod';
import logo from '../../Img/logo.png';
import { IndexAndAlertMessage, LoginUserObject, PasswordResetEmail } from '../../validators';
import { Alert } from '../Alert/Alert';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
const TV_SHOW_TRACKER_API_BASE_URL = process.env.REACT_APP_API_BASE_URL

interface LoginFormModalProps {
  setShowLoginModal: (params: boolean) => any;
  loginUser: (emailAddress: string, password: string) => Promise<any>;
  createAccount: () => any;
}

const LoginFormModal = ({ setShowLoginModal, loginUser, createAccount }: LoginFormModalProps) => {

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessages, setErrorMessages] = useState<IndexAndAlertMessage[]>([]);
  // Index added to try to be able to remove alerts after timeout and still have known unique indices
  const [errorMessageLastIndex, setErrorMessageLastIndex] = useState(0);

  const handleOnClose = (event: any) => {
    // Only close when background or button is clicked
    if (event.target.id === 'container' || event.target.id === 'closebutton') {
      setShowLoginModal(false);
    }
  }

  const handleBackToLogin = (event: any) => {
    // Only close when background or button is clicked
    if (event.target.id === 'backbutton') {
      setShowPasswordResetForm(false)
      setShowSpinner(false)
    }
  }

  const openPasswordResetForm = () => {
    setShowPasswordResetForm(true)
  }

  const handleSendPasswordResetEmail = async (event: any) => {
    event.preventDefault();

    try {
      setShowSpinner(true)
      PasswordResetEmail.parse(emailAddress)
      const { data, status } = await axios.post<any>(
        `${TV_SHOW_TRACKER_API_BASE_URL}/ResetPassword`,
        { emailAddress }
      );
      console.log(`Response status: ${status}`)
      setMessage(data)
      setShowSpinner(false)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(JSON.stringify(error.issues))
        let currentIndex = errorMessageLastIndex;
        const errorsToAdd = error.issues.map((issue) => {
          currentIndex++
          return { index: currentIndex, message: issue.message }
        })
        setShowSpinner(false)
        setErrorMessageLastIndex(currentIndex)
        setErrorMessages(errorMessages.concat(errorsToAdd))
        return;
      }
      setShowSpinner(false)
      setErrorMessageLastIndex(errorMessageLastIndex + 1)
      const message = axios.isAxiosError(error) ? 'Email address incorrect' : 'Sending email failed'
      setErrorMessages([...errorMessages, { index: errorMessageLastIndex + 1, message }])
    }
  }

  const renderErrorMessages = (errorMessages: IndexAndAlertMessage[]) => {
    return errorMessages.map((error, index) => (<Alert key={index} message={error.message} index={error.index} closeAlert={closeAlert} />))
  }

  const closeAlert = (indexToRemove: number) => {
    console.log(`current errorMessages: ${JSON.stringify(errorMessages, null, 2)}`)
    console.log(`Closing: ${indexToRemove}`)
    setErrorMessages(errorMessages.filter((message) => message.index !== indexToRemove))
  }

  const handleLogin = async (event: any) => {
    event.preventDefault();

    try {
      LoginUserObject.parse({ emailAddress, password })

      setShowSpinner(true)
      await loginUser(emailAddress, password)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(JSON.stringify(error.issues))
        let currentIndex = errorMessageLastIndex;
        const errorsToAdd = error.issues.map((issue) => {
          currentIndex++
          return { index: currentIndex, message: issue.message }
        })
        setErrorMessageLastIndex(currentIndex)
        setErrorMessages(errorMessages.concat(errorsToAdd))
        return;
      }
      setShowSpinner(false)
      setErrorMessageLastIndex(errorMessageLastIndex + 1)
      const message = axios.isAxiosError(error) ? 'Email address or password incorrect' : 'Login failed'
      setErrorMessages([...errorMessages, { index: errorMessageLastIndex + 1, message }])
    }

    return true;
  }

  return (
    <>
      <div id='container' onClick={handleOnClose} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm
      flex justify-center items-center">

        <div className="bg-white max-w-md w-full space-y-8 p-10 rounded-md dark:bg-gray-700 dark:text-white">
          <div className="flex justify-between items-start rounded-t">
            {showPasswordResetForm && <button id='backbutton' type="button" onClick={handleBackToLogin} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
              <svg id='backbutton' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path id='backbutton' strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              <span className="sr-only pointer-events-none">Back to login</span>
            </button>}
            <button id='closebutton' type="button" onClick={handleOnClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
              <svg id='closebutton' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path id='closebutton' strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="sr-only pointer-events-none">Close modal</span>
            </button>
          </div>
          <div style={{ marginTop: "0" }}>
            <img
              className="mx-auto h-24 w-auto"
              src={logo}
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">{showPasswordResetForm ? 'Please enter your email address' : 'Sign in to your account'}</h2>
          </div>
          {showSpinner ? <div className="inline-flex justify-center w-full"><LoadingSpinner /></div> :
            <form className="mt-8 space-y-6" action="#" method="POST">
              {errorMessages ? renderErrorMessages(errorMessages) : null}
              <input type="hidden" name="remember" defaultValue="true" />
              <div className="rounded-md shadow-sm -space-y-px">
                {!message && <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={emailAddress}
                    onChange={e => setEmailAddress(e.target.value)}
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border dark:bg-gray-700 dark:text-white border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email address"
                  />
                </div>}
                {!showPasswordResetForm && <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="appearance-none rounded-none dark:bg-gray-700 dark:text-white relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>}
              </div>

              {!showPasswordResetForm && <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-white">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button onClick={openPasswordResetForm} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-white">
                    Forgot your password?
                  </button>
                </div>
              </div>}

              <div>
                {!message ? <button
                  onClick={showPasswordResetForm ? handleSendPasswordResetEmail : handleLogin}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                  </span>
                  {showPasswordResetForm ? 'Send reset email' : 'Sign in'}
                </button> :
                  <div className='text-center'><b>{message}</b></div>}
              </div>
              <div className='text-center'>Don't have an account yet? <button className='underline' onClick={() => createAccount()}>Create one!</button></div>
            </form>}
        </div>
      </div>
    </>
  )
}

export default LoginFormModal;
