import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from '../../Img/logo.png';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';


const UnsubscribeEmailModal = () => {
    let params = useParams();
    const [showSpinner, setShowSpinner] = useState(false);
    const [message, setMessage] = useState('');
    const TV_SHOW_TRACKER_API_BASE_URL = process.env.REACT_APP_API_BASE_URL


    const callUnsubscribeEndpoint = async () => {
        const { data } = await axios.post<any>(
            `${TV_SHOW_TRACKER_API_BASE_URL}/UpdateUser`,
            { emailAddress: params.emailAddress, unsubscribeEmailToken: params.token }
        );
        return data;
    }

    const navigate = useNavigate();
    const handleClose = (event: any) => {
        if (event.target.id === 'container' || event.target.id === 'closebutton') {
            let path = `/`;
            navigate(path);
        }
    }

    useEffect(() => {

        setShowSpinner(true)
        callUnsubscribeEndpoint().then((data) => {
            console.log('Response status is: ', data);
            setMessage(data)
            setShowSpinner(false)
        }).catch((error) => {
            setShowSpinner(false)
            setMessage(`Failed due to: ${error.response.data}`)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div id='container' onClick={handleClose} className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm
      flex justify-center items-center" >
                <div className="bg-white max-w-2xl w-full space-y-8 p-10 rounded-md dark:bg-gray-700 dark:text-white" >
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
                        <h2 className="mt-6 text-center text-md font-extrabold text-gray-900 dark:text-white">Unsubscribing {params.emailAddress} from emails</h2>
                    </div>
                    {showSpinner ? <div className="mt-8 space-y-6"><LoadingSpinner /></div> :
                        <div className='text-center'>
                            {message}
                        </div>}
                </div>
            </div>
        </>
    )
}

export default UnsubscribeEmailModal;
