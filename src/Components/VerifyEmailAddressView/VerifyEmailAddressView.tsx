import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../../Img/logo.png";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

export default function VerifyEmailAddressView() {
	let params = useParams();
	const [showSpinner, setShowSpinner] = useState(false);
	const [message, setMessage] = useState("");
	const [success, setSuccess] = useState(false);
	const TV_SHOW_TRACKER_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

	const callVerifyEmailAddressEndpoint = async () => {
		const { data } = await axios.post<AxiosResponse<string>>(`${TV_SHOW_TRACKER_API_BASE_URL}/UpdateUser`, {
			emailAddress: params.emailAddress,
			verifyEmailAddressToken: params.token,
		});
		return data;
	};

	useEffect(() => {
		setShowSpinner(true);
		callVerifyEmailAddressEndpoint()
			.then((data) => {
				console.log("Response status is: ", data);
				setSuccess(true);
				setShowSpinner(false);
				handleSuccess();
			})
			.catch((error) => {
				setShowSpinner(false);
				setMessage(`Failed due to: ${error.response.data}`);
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const navigate = useNavigate();

	const handleSuccess = async () => {
		if (params.mobileRegistration === "true") {
			setMessage("Registration successful, you can now log in to the TV Tracker app!");
		} else {
			let path = `/`;
			navigate(path);
		}
	};

	return (
		<>
			<div>
				<div className="bg-gray-800 w-full h-screen space-y-8 p-10 dark:bg-gray-700 text-white">
					<div className="flex justify-between items-start rounded-t">
						<Link
							id="closebutton"
							to="/"
							type="button"
							className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
							data-modal-toggle="defaultModal"
						>
							<svg
								id="closebutton"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path
									id="closebutton"
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
							<span className="sr-only pointer-events-none">Close modal</span>
						</Link>
					</div>
					<div style={{ marginTop: "0" }}>
						<img className="mx-auto h-24 w-auto" src={logo} alt="Workflow" />
						{success ? (
							<h2 className="mt-6 text-center text-md font-extrabold text-white">Done!</h2>
						) : (
							<h2 className="mt-6 text-center text-md font-extrabold text-white">
								Verifying your email address..
							</h2>
						)}
					</div>
					{showSpinner && (
						<div className="inline-flex justify-center w-full text-white">
							<LoadingSpinner forcedWhite={true} />
						</div>
					)}

					{!showSpinner && message && <div className="text-center">{message}</div>}
				</div>
			</div>
		</>
	);
}
