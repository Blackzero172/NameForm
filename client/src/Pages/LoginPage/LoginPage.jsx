import CustomInput from "../../components/CustomInput/CustomInput.components";
import CustomButton from "../../components/CustomButton/CustomButton.components";
import "./LoginPage.css";
import { useEffect } from "react";
const LoginPage = ({ setCredentials, credentials, onLogin }) => {
	const { email, password } = credentials;
	const handleFormSubmit = (e) => {
		e.preventDefault();
		onLogin();
	};
	useEffect(() => {
		onLogin();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<form className="login-page flex-both" onSubmit={handleFormSubmit}>
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
		</form>
	);
};
export default LoginPage;
