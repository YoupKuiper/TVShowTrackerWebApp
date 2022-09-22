import axios from 'axios';
import { LockClosedIcon } from '@heroicons/react/solid'
import { useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from '../../Img/logo.png';
import { IndexAndAlertMessage, PasswordResetObject } from '../../validators';
import { Alert } from '../Alert/Alert';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { z } from 'zod';


const ResetPasswordModal = () => {
    let params = useParams();
    const [showSpinner, setShowSpinner] = useState(false);
    const [message, setMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errorMessages, setErrorMessages] = useState<IndexAndAlertMessage[]>([]);
    const [repeatedPassword, setRepeatedPassword] = useState('');
    const [errorMessageLastIndex, setErrorMessageLastIndex] = useState(0);
    const TV_SHOW_TRACKER_API_BASE_URL = process.env.REACT_APP_API_BASE_URL

    const callResetPasswordEndpoint = async () => {
        const { data } = await axios.post<any>(
            `${TV_SHOW_TRACKER_API_BASE_URL}/UpdateUser`,
            { emailAddress: params.emailAddress, resetPasswordToken: params.token, newPassword }
        );

        setMessage(data)
        return data;
    }

    const handleResetPassword = async (event: any) => {
        event.preventDefault();

        try {
            console.log(newPassword)
            console.log(repeatedPassword)
            PasswordResetObject.parse({ newPassword, repeatedPassword })
            setShowSpinner(true)
            await callResetPasswordEndpoint()
            setShowSpinner(false)
            
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
            const message = 'Password reset failed'
            setErrorMessages([...errorMessages, { index: errorMessageLastIndex + 1, message }])
          }
      
          return true;
    }

    const renderErrorMessages = (errorMessages: IndexAndAlertMessage[]) => {
        return errorMessages.map((error, index) => (<Alert key={index} message={error.message} index={error.index} closeAlert={closeAlert} />))
    }


    const closeAlert = (indexToRemove: number) => {
        console.log(`current errorMessages: ${JSON.stringify(errorMessages, null, 2)}`)
        console.log(`Closing: ${indexToRemove}`)
        setErrorMessages(errorMessages.filter((message) => message.index !== indexToRemove))
    }

    const navigate = useNavigate();
    const handleClose = (event: any) => {
        if (event.target.id === 'container' || event.target.id === 'closebutton') {
            let path = `/`;
            navigate(path);
        }
    }

    return (
        <>
            <div id='container' onClick={handleClose} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm
      flex justify-center items-center" >
                <div className="bg-white max-w-md w-full space-y-8 p-10 rounded-md dark:bg-gray-700 dark:text-white" >
                    <div className="flex justify-between items-start rounded-t">
                        <Link id='closebutton' to="/" type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="defaultModal">
                            <svg aria-hidden="true" className="w-5 h-5 pointer-events-none" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            <span className="sr-only pointer-events-none">Close modal</span>
                        </Link>
                    </div>
                    <div style={{ marginTop: "0" }}>
                        <img
                            className="mx-auto h-24 w-auto"
                            src={logo}
                            alt="Workflow"
                        />
                        <h2 className="mt-6 text-center text-md font-extrabold text-gray-900 dark:text-white">Enter your new password</h2>
                    </div>
                    {showSpinner && <div className="inline-flex justify-center w-full"><LoadingSpinner /></div>}
                        {!showSpinner && !message && <form className="mt-8 space-y-6" action="#" method="POST">
                            {errorMessages ? renderErrorMessages(errorMessages) : null}
                            <input type="hidden" name="remember" defaultValue="true" />
                            <div className="rounded-md shadow-sm -space-y-px">
                                <div>
                                    <label htmlFor="password" className="sr-only">
                                        New Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className="appearance-none rounded-none dark:bg-gray-700 dark:text-white relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="password" className="sr-only">
                                        Repeat password
                                    </label>
                                    <input
                                        id="repeatpassword"
                                        name="password"
                                        type="password"
                                        value={repeatedPassword}
                                        onChange={e => setRepeatedPassword(e.target.value)}
                                        className="appearance-none rounded-none relative dark:bg-gray-700 dark:text-white block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Password"
                                    />
                                </div>

                                <div className='py-6'>
                                    <button
                                        onClick={handleResetPassword}
                                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                            <LockClosedIcon className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                                        </span>
                                        Reset Password
                                    </button>
                                </div>
                            </div>
                        </form>}
                        {!showSpinner && message &&
                        <div className='text-center'>
                            {message}
                        </div>}
                </div>
            </div>
        </>
    )
}

export default ResetPasswordModal;
