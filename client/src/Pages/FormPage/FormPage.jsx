import { debounce } from "debounce";
import { isMobilePhone, isIdentityCard, isAlpha, isBefore } from "validator";
import { useRef, useState } from "react";
import ChildCard from "../../components/ChildCard/ChildCard";
import CustomButton from "../../components/CustomButton/CustomButton.components";
import CustomInput from "../../components/CustomInput/CustomInput.components";

import "./FormPage.css";
const FormPage = ({ setCredentials, credentials, getPerson, person, setUser, updatePerson }) => {
	const { IdNumber, phoneNumber } = credentials;
	const { name, children, birthDate } = person;
	const remoteIdNumber = person.IdNumber;
	const remotePhoneNumber = person.phoneNumber;
	const errorMessageRef = useRef();
	const [personCopy, setCopy] = useState({});
	const [formHasError, setError] = useState(true);
	const setText = debounce(() => {
		errorMessageRef.current.innerText = "";
	}, 4000);
	const handleErrorMessage = (e) => {
		console.log(e.message);
		errorMessageRef.current.innerText = e.message.includes("ID number")
			? "رقم الهوية خطء"
			: e.message.includes("Phone Number")
			? "رقم الهاتف خطء"
			: "";
		setText.clear();
		setText();
	};
	const handleFormSubmit = async (e) => {
		e.preventDefault();
		try {
			await getPerson();
			setError(true);
		} catch (e) {
			handleErrorMessage(e);
		}
	};
	const handleIncorrectFields = () => {
		if (isMobilePhone(phoneNumber, "he-IL") && isIdentityCard(IdNumber, "he-IL")) setError(false);
		else setError(true);
	};
	const checkField = (e) => {
		if (
			(isIdentityCard(e.target.value, "he-IL") ||
				isMobilePhone(e.target.value, "he-IL") ||
				isAlpha(e.target.value) ||
				isBefore(e.target.value)) &&
			e.target.value !== ""
		) {
			e.target.classList.remove("error");
		} else {
			e.target.classList.add("error");
			setError(true);
		}
	};
	const changeChildInfo = (child, prop, value) => {
		const childrenCopy = [...children];
		const childCopy = childrenCopy[childrenCopy.indexOf(child)];
		childCopy[prop] = value;
		setUser({ ...person, children: childrenCopy });
	};
	return !person.hasOwnProperty("name") ? (
		<form className="form-page flex-both flex-column" onSubmit={handleFormSubmit}>
			<div className="window flex-both flex-column">
				<CustomInput
					label="رقم الهوية"
					value={IdNumber}
					onChange={(e) => {
						setCredentials({ ...credentials, IdNumber: e.target.value });
					}}
					onBlur={(e) => {
						handleIncorrectFields();
						checkField(e);
					}}
				/>
				<CustomInput
					label="رقم الهاتف"
					value={phoneNumber}
					onChange={(e) => {
						setCredentials({ ...credentials, phoneNumber: e.target.value });
						checkField(e);
					}}
					onBlur={(e) => {
						handleIncorrectFields();
						checkField(e);
					}}
				/>
				<p className="error-message red" ref={errorMessageRef}></p>
				<CustomButton text="الدخول" type="submit" disabled={formHasError} />
			</div>
		</form>
	) : (
		<form
			className="form-page flex-both flex-column"
			onSubmit={async (e) => {
				e.preventDefault();
				try {
					const response = await updatePerson();
					setCopy(response);
				} catch (e) {
					handleErrorMessage(e);
				}
			}}
		>
			{!personCopy.name ? (
				<>
					<div className="window flex-both flex-column">
						<div className="upper-section flex-both">
							<CustomInput
								label="الاسم"
								value={name}
								onChange={(e) => {
									setUser({ ...person, name: e.target.value });
									checkField(e);
								}}
								onBlur={(e) => {
									handleIncorrectFields();
									checkField(e);
								}}
							/>
							<CustomInput
								label="رقم الهاتف"
								value={remotePhoneNumber}
								onChange={(e) => {
									setUser({ ...person, phoneNumber: e.target.value });
								}}
								onBlur={(e) => {
									handleIncorrectFields();
									checkField(e);
								}}
							/>
						</div>
						<div className="lower-section flex-both">
							<CustomInput
								label="رقم الهوية"
								value={remoteIdNumber}
								onChange={(e) => {
									setUser({ ...person, IdNumber: e.target.value });
								}}
								onBlur={(e) => {
									handleIncorrectFields();
									checkField(e);
								}}
							/>
							<CustomInput
								type="number"
								label="عدد الاطفال"
								onChange={(e) => {
									if (e.target.value > 10) {
										e.target.value = 10;
									}
								}}
								onBlur={(e) => {
									if (e.target.value <= 10) {
										const children = [];
										for (let i = 0; i < e.target.value; i++) {
											children.push({
												name: "",
												phoneNumber: "",
												birthDate: "",
											});
										}
										setUser({
											...person,
											children,
										});
									}
								}}
							/>
						</div>
						<CustomInput
							label="تاريخ الميلاد"
							value={birthDate}
							type="Date"
							onChange={(e) => {
								setUser({ ...person, birthDate: e.target.value });
							}}
							onBlur={(e) => {
								handleIncorrectFields();
								checkField(e);
							}}
						/>
					</div>

					{children.map((child) => {
						return (
							<ChildCard
								child={child}
								onChange={changeChildInfo}
								onBlur={(e) => {
									handleIncorrectFields();
									checkField(e);
								}}
							/>
						);
					})}
					<p className="error-message red" ref={errorMessageRef}></p>
					<CustomButton text="ارسال" type="submit" disabled={formHasError} />
				</>
			) : (
				"!تم ارسال المعلومات بنجاح"
			)}
		</form>
	);
};
export default FormPage;
