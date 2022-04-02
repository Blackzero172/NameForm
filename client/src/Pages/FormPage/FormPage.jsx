import CustomButton from "../../components/CustomButton/CustomButton.components";
import CustomInput from "../../components/CustomInput/CustomInput.components";

import "./FormPage.css";
const FormPage = ({ setCredentials, credentials, getPerson, person, setUser }) => {
	const handleFormSubmit = (e) => {
		e.preventDefault();
		getPerson();
	};
	const { IdNumber } = credentials;
	const { name, phoneNumber, children } = person;
	const remoteIdNumber = person.IdNumber;
	return !person.hasOwnProperty("name") ? (
		<form className="form-page flex-both flex-column" onSubmit={handleFormSubmit}>
			<div className="window flex-both flex-column">
				<CustomInput
					label="رقم الهوية"
					value={IdNumber}
					onChange={(e) => {
						setCredentials({ ...credentials, IdNumber: e.target.value });
					}}
				/>
				<CustomButton text="الدخول" type="submit" />
			</div>
		</form>
	) : (
		<form
			className="form-page flex-both flex-column"
			onSubmit={(e) => {
				e.preventDefault();
			}}
		>
			<div className="window flex-both flex-column">
				<CustomInput
					label="الاسم"
					value={name}
					onChange={(e) => {
						setUser({ ...person, name: e.target.value });
					}}
				/>
				<CustomInput
					label="رقم الهاتف"
					value={phoneNumber}
					onChange={(e) => {
						setUser({ ...person, phoneNumber: e.target.value });
					}}
				/>
				<CustomInput
					label="رقم الهوية"
					value={remoteIdNumber}
					onChange={(e) => {
						setUser({ ...person, IdNumber: e.target.value });
					}}
				/>
				<CustomInput
					type="number"
					label="عدد الاطفال"
					value={children.length}
					onChange={(e) => {
						if (e.target.value <= 10)
							setUser({ ...person, children: new Array(parseInt(e.target.value || 0)) });
					}}
				/>
				<CustomButton text="الدخول" type="submit" />
			</div>
		</form>
	);
};
export default FormPage;
