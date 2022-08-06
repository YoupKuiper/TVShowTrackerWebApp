import { PlusIcon } from '@heroicons/react/solid'
import { useState } from 'react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { z } from "zod";
import { IndexAndAlertMessage, UserAccountCreation } from '../../validators';
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
  const [errorMessages, setErrorMessages] = useState<IndexAndAlertMessage[]>([]);
  // Index added to try to be able to remove alerts after timeout and still have known unique indices
  const [errorMessageLastIndex, setErrorMessageLastIndex] = useState(0);

  const handleOnClose = (event: any) => {
    // Only close when background is clicked
    if (event.target.id === 'container' || event.target.id === 'closebutton') {
      setShowCreateAccountModal(false);
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

  const handleCreateUserAccount = async (event: any) => {
    event.preventDefault();

    try {
      UserAccountCreation.parse({ emailAddress, password, repeatedPassword })
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
          <div className="flex justify-between items-start rounded-t">
            <button id='closebutton' type="button" onClick={handleOnClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
              <svg aria-hidden="true" className="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              <span className="sr-only pointer-events-none">Close modal</span>
            </button>
          </div>
          <div style={{ marginTop: "0" }}>
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
