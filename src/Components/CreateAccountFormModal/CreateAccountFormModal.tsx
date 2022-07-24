import { PlusIcon } from '@heroicons/react/solid'
import { useState } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { z, ZodIssue } from "zod";
import { UserAccountCreation } from '../../validators';
import { Alert } from '../Alert/Alert';

interface CreateAccountFormModalProps {
  setShowCreateAccountModal: (params: boolean) => any;
  createUserAccount: (emailAddress: string, password: string) => Promise<any>;
}

const CreateAccountFormModal = ({ setShowCreateAccountModal, createUserAccount }: CreateAccountFormModalProps) => {

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const [errorMessages, setErrorMessages] = useState<ZodIssue[]>([])

  const handleOnClose = (event: any) => {
    // Only close when background is clicked
    if (event.target.id === 'container') {
      setShowCreateAccountModal(false);
    }
  }

  const renderErrorMessages = (errorMessages: ZodIssue[]) => {
    return errorMessages.map((error) => (<Alert message={error.message}/>))
  }

  const handleCreateUserAccount = async (event: any) => {
    event.preventDefault();

    try {
      UserAccountCreation.parse({ emailAddress, password, repeatedPassword })
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(JSON.stringify(error.issues))
        setErrorMessages(error.issues)
        return;
      }
    }

    // Show loading spinner
    setShowSpinner(true)
    // Do api call to log in
    await createUserAccount(emailAddress, password)
    // If success, save token to localstorage and close the modal
    setShowCreateAccountModal(false)
    // If fail, show invalid credentials message
    return true;
  }

  return (
    <>
      <div id='container' onClick={handleOnClose} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm
      flex justify-center items-center">

        <div className="bg-white max-w-md w-full space-y-8 p-10 rounded-md">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your free account</h2>
          </div>
          {showSpinner ? <div className="mt-8 space-y-6"><LoadingSpinner /></div> :
            <form className="mt-8 space-y-6" action="#" method="POST">
              {errorMessages ? renderErrorMessages(errorMessages) : null}
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
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">
                    Repeat password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={repeatedPassword}
                    onChange={e => setRepeatedPassword(e.target.value)}
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
              </div>

              <div>
                <button
                  onClick={handleCreateUserAccount}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <PlusIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                  </span>
                  Create account
                </button>
              </div>
            </form>}
        </div>
      </div>
    </>
  )
}

export default CreateAccountFormModal;
