import axios from 'axios';
import { LockClosedIcon } from '@heroicons/react/solid'
import { useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from '../../Img/logo.png';
import { PasswordResetObject } from '../../validators';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { z } from 'zod';
import { toast } from 'react-toastify';


const ResetPasswordModal = () => {
    let params = useParams();
    const [showSpinner, setShowSpinner] = useState(false);
    const [message, setMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatedPassword, setRepeatedPassword] = useState('');
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
        } catch (error) {
            if (error instanceof z.ZodError) {
                return error.issues.map((issue) => {
                    return toast.error(issue.message, {
                        position: "top-center",
                        theme: "light",
                    });
                })
            }
            return toast.error('Password reset failed', {
                position: "top-center",
                theme: "light",
            });
        }
        setShowSpinner(false)

        return true;
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
                            <svg id='closebutton' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path id='closebutton' strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
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
