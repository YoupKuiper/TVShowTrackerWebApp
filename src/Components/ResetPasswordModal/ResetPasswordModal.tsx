import { LockClosedIcon } from "@heroicons/react/solid";
import axios, { AxiosResponse } from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import logo from "../../Img/logo.png";
import { PasswordResetObject } from "../../validators";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

const ResetPasswordModal = () => {
	let params = useParams();
	const [showSpinner, setShowSpinner] = useState(false);
	const [message, setMessage] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [repeatedPassword, setRepeatedPassword] = useState("");
	const TV_SHOW_TRACKER_API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

	const callResetPasswordEndpoint = async () => {
		const { data } = await axios.post<AxiosResponse<string>>(`${TV_SHOW_TRACKER_API_BASE_URL}/UpdateUser`, {
			emailAddress: params.emailAddress,
			resetPasswordToken: params.token,
			newPassword,
		});

		setMessage(data.toString());
		return data;
	};

	const handleResetPassword = async (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		event.preventDefault();

		try {
			console.log(newPassword);
			console.log(repeatedPassword);
			PasswordResetObject.parse({ newPassword, repeatedPassword });
			setShowSpinner(true);
			await callResetPasswordEndpoint();
		} catch (error) {
			if (error instanceof z.ZodError) {
				return error.issues.map((issue) => {
					return toast.error(issue.message, {
						position: "top-center",
						theme: "light",
					});
				});
			}
			return toast.error("Password reset failed", {
				position: "top-center",
				theme: "light",
			});
		}
		setShowSpinner(false);

		return true;
	};

	return (
		<>
			<div
				id="container"
				className="bg-gray-700  
      flex justify-center items-center h-full w-full"
			>
				<div className="max-w-md space-y-8 p-10 rounded-md bg-gray-700 text-white">
					<div style={{ marginTop: "0" }}>
						<img className="mx-auto h-24 w-auto" src={logo} alt="Workflow" />
						<h2 className="mt-6 text-center text-md font-extrabold text-white">Enter your new password</h2>
					</div>
					{showSpinner && (
						<div className="inline-flex justify-center w-full">
							<LoadingSpinner />
						</div>
					)}
					{!showSpinner && !message && (
						<form className="mt-8 space-y-6" action="#" method="POST">
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
										onChange={(e) => setNewPassword(e.target.value)}
										className="appearance-none rounded-none bg-gray-700 text-white relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500  focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
										onChange={(e) => setRepeatedPassword(e.target.value)}
										className="appearance-none rounded-none relative bg-gray-700 text-white block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
										placeholder="Confirm password"
									/>
								</div>

								<div className="py-6">
									<button
										onClick={handleResetPassword}
										className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										<span className="absolute left-0 inset-y-0 flex items-center pl-3">
											<LockClosedIcon
												className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
												aria-hidden="true"
											/>
										</span>
										Reset Password
									</button>
								</div>
							</div>
						</form>
					)}
					{!showSpinner && message && <div className="text-center">{message}</div>}
				</div>
			</div>
		</>
	);
};

export default ResetPasswordModal;
