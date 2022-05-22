import CustomInput from "../../components/CustomInput/CustomInput.components";
import CustomButton from "../../components/CustomButton/CustomButton.components";
import "./LoginPage.css";
import { useEffect, useRef } from "react";
import { debounce } from "debounce";
const LoginPage = ({ setCredentials, credentials, onLogin }) => {
	const { email, password } = credentials;
	const errorMessageRef = useRef();
	const resetText = debounce(() => {
		errorMessageRef.current.innerText = "";
	}, 4000);
	const handleFormSubmit = async (e) => {
		e.preventDefault();
		const message = await onLogin();
		if (message === "Unable to login") errorMessageRef.current.innerText = "تفاصيل الدخول خطء";
		resetText();
	};
	useEffect(() => {
		onLogin();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<form className="login-page flex-both flex-column" onSubmit={handleFormSubmit}>
			<div className="window flex-both flex-column">
				<label>تسجيل الدخول</label>
				<CustomInput
					label="البريد الالكتروني"
					value={email}
					onChange={(e) => {
						setCredentials({ ...credentials, email: e.target.value });
					}}
					name="email"
				/>
				<CustomInput
					type="password"
					label="كلمة المرور"
					value={password}
					onChange={(e) => {
						setCredentials({ ...credentials, password: e.target.value });
					}}
					name="Password"
				/>
				<CustomButton text="دخول" type="submit" />
			</div>
			<p className="red" ref={errorMessageRef}></p>
		</form>
	);
};
export default LoginPage;
