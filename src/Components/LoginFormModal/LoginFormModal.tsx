import { LockClosedIcon } from '@heroicons/react/solid';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { z } from 'zod';
import logo from '../../Img/logo.png';
import { LoginUser, LoginUserObject, PasswordResetEmail, User } from '../../validators';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import "react-toastify/dist/ReactToastify.css";
const TV_SHOW_TRACKER_API_BASE_URL = process.env.REACT_APP_API_BASE_URL

interface LoginFormModalProps {
  setShowLoginModal: (params: boolean) => any;
  loginUser: (emailAddress: string, password: string) => Promise<any>;
  createAccount: () => any;
  setLoggedInUser: (user: User) => any;
}

const LoginFormModal = ({ setShowLoginModal, loginUser, createAccount, setLoggedInUser }: LoginFormModalProps) => {

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const [showPasswordResetForm, setShowPasswordResetForm] = useState(false);
  const [message, setMessage] = useState('');

  const userMutation = useMutation((userLogin: LoginUser) => {
    return loginUser(userLogin.emailAddress, userLogin.password)
  })

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
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues.map((issue) => {
          return toast.error(issue.message, {
            position: "top-center",
            theme: "light",
          });
        })
      }
      const message = axios.isAxiosError(error) ? 'Email address incorrect' : 'Sending email failed'
      toast.error(message, {
        position: "top-center",
        theme: "light",
      });
    }
    setShowSpinner(false)
  }

  const handleLogin = async (event: any) => {
    event.preventDefault();

    try {
      LoginUserObject.parse({ emailAddress, password })
      await userMutation.mutateAsync({ emailAddress, password })

    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.issues.map((issue) => {
          return toast.error(issue.message, {
            position: "top-center",
            theme: "light",
          });
        })
      }
      const message = axios.isAxiosError(error) ? 'Email address or password incorrect' : 'Login failed'
      toast.error(message, {
        position: "top-center",
        theme: "light",
      });
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
          {showSpinner || userMutation.isLoading ? <div className="inline-flex justify-center w-full"><LoadingSpinner /></div> :
            <form className="mt-8 space-y-6" action="#" method="POST" >
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
                    ref={input => input && input.focus()}
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
                  <button type="button" onClick={openPasswordResetForm} className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-white">
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
