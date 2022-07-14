import { debounce } from "debounce";
import { useRef, useState } from "react";
import CustomButton from "../../components/CustomButton/CustomButton.components";
import CustomInput from "../../components/CustomInput/CustomInput.components";

import "./FormPage.css";
import AddWindow from "../../components/AddWindow/AddWindow";
const FormPage = ({ setCredentials, credentials, getPerson, person, editPerson, updatePerson }) => {
	const [statusCode, setStatusCode] = useState(0);
	const { email, phoneNumber, secretKey } = credentials;
	const errorMessageRef = useRef();
	const setText = debounce(() => {
		errorMessageRef.current.innerText = "";
	}, 4000);
	const handleErrorMessage = (e) => {
		errorMessageRef.current.innerText = e.message.includes("Email")
			? "البريد الالكتروني غير صحيح"
			: e.message.includes("Phone Number")
			? "رقم الهاتف غير صحيح"
			: e.message.includes("Wrong Key") || e.message.includes("Authenticate")
			? "المفتاح غير صحيح"
			: e.message;
		setText.clear();
		setText();
	};
	const handleFormSubmit = async (e) => {
		e.preventDefault();
		try {
			await getPerson(credentials);
		} catch (e) {
			handleErrorMessage(e);
		}
	};

	return !person.hasOwnProperty("name") ? (
		<form className="form-page flex-both flex-column" onSubmit={handleFormSubmit}>
			<div className="window flex-both flex-column">
				<CustomInput
					required
					label="البريد الالكتروني"
					value={email}
					onChange={(e) => {
						setCredentials({ ...credentials, email: e.target.value.trim() });
					}}
				/>
				<CustomInput
					required
					type="number"
					label="رقم الهاتف"
					minLength="10"
					value={phoneNumber}
					onChange={(e) => {
						setCredentials({ ...credentials, phoneNumber: e.target.value });
					}}
				/>
				<CustomInput
					required
					label="المفتاح السري"
					value={secretKey}
					onChange={(e) => {
						setCredentials({ ...credentials, secretKey: e.target.value.trim() });
					}}
				/>
				<p className="error-message red" ref={errorMessageRef}></p>
				<CustomButton text="الدخول" type="submit" />
			</div>
		</form>
	) : statusCode !== 200 ? (
		<AddWindow
			person={person}
			isFixed={false}
			updatePerson={updatePerson}
			editPerson={async () => {
				try {
					const statusCode = await editPerson();
					setStatusCode(statusCode);
				} catch (e) {
					console.error(e);
				}
			}}
		/>
	) : (
		<div className="confirm-text flex-both">!تم ارسال المعلومات بنجاح</div>
	);
};
export default FormPage;
