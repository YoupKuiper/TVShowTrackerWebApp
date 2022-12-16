import { PlusIcon } from '@heroicons/react/solid';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { z } from "zod";
import logo from '../../Img/logo.png';
import { UserAccountCreation } from '../../validators';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

interface CreateAccountFormModalProps {
  setShowCreateAccountModal: (params: boolean) => void;
  createUserAccount: (emailAddress: string, password: string) => Promise<void>;
}

const CreateAccountFormModal = ({ setShowCreateAccountModal, createUserAccount }: CreateAccountFormModalProps) => {

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSuccessfulCreation, setShowSuccessfulCreation] = useState(false)

  const handleOnClose = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    // Only close when background is clicked
    const element = event.target as HTMLElement
    if (element.id === 'container' || element.id === 'closebutton') {
      setShowCreateAccountModal(false);
    }
  }

  const handleCreateUserAccount = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    event.preventDefault();

    try {
      UserAccountCreation.parse({ emailAddress, password, repeatedPassword })
      // Show loading spinner
      setShowSpinner(true)
      // Do api call to log in
      await createUserAccount(emailAddress, password)
      // If success, show successful account creation message
      setShowSpinner(false)
      setShowSuccessfulCreation(true)
    } catch (error) {
      setShowSpinner(false)
      if (error instanceof z.ZodError) {
        return error.issues.map((issue) => {
          return toast.error(issue.message, {
            position: "top-center",
            theme: "light",
          });
        })
      }
      toast.error('Account creation failed', {
        position: "top-center",
        theme: "light",
      });
    }
    setShowSpinner(false)
  }

  return (
    <>
      <div id='container' onClick={handleOnClose} className="tst-create-account-modal fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm
      flex justify-center items-center">

        <div className="bg-white max-w-md w-full space-y-8 p-10 rounded-md dark:bg-gray-700 dark:text-white">
          <div className="flex justify-between items-start rounded-t">
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
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:bg-gray-700 dark:text-white">Create your free account</h2>
          </div>
          {showSpinner && <div className="inline-flex justify-center w-full"><LoadingSpinner /></div>}
          {!showSuccessfulCreation && !showSpinner && <form className="mt-8 space-y-6" action="#" method="POST">
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
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
                  className="appearance-none rounded-none dark:bg-gray-700 dark:text-white relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
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
                  className="appearance-none rounded-none dark:bg-gray-700 dark:text-white relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Repeat password
                </label>
                <input
                  id="password1"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={repeatedPassword}
                  onChange={e => setRepeatedPassword(e.target.value)}
                  required
                  className="appearance-none rounded-none relative dark:bg-gray-700 dark:text-white block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div>
              <button
                onClick={handleCreateUserAccount}
                className="tst-create-account-button group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <PlusIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                </span>
                Create account
              </button>
            </div>
          </form>}
          {showSuccessfulCreation && <div className='text-center'>
            <h1>Great success!</h1>
            <p>Check your inbox for a verification link!</p>
            <p>Email verification is needed to receive notifications</p>
          </div>}
        </div>
      </div>
    </>
  )
}

export default CreateAccountFormModal;
