import { debounce } from "debounce";
import mongoose from "mongoose";
import { useRef, useState } from "react";
import ChildCard from "../../components/ChildCard/ChildCard";
import CustomButton from "../../components/CustomButton/CustomButton.components";
import CustomInput from "../../components/CustomInput/CustomInput.components";

import "./FormPage.css";
const FormPage = ({ setCredentials, credentials, getPerson, person, setUser, updatePerson }) => {
	const { IdNumber, phoneNumber, secretKey } = credentials;
	const { name, children, birthDate } = person;
	const remoteIdNumber = person.IdNumber;
	const remotePhoneNumber = person.phoneNumber;
	const errorMessageRef = useRef();
	const [personCopy, setCopy] = useState({});
	const setText = debounce(() => {
		errorMessageRef.current.innerText = "";
	}, 4000);
	const handleErrorMessage = (e) => {
		console.log(e.message);
		errorMessageRef.current.innerText = e.message.includes("ID number")
			? "رقم الهوية خطء"
			: e.message.includes("Phone Number")
			? "رقم الهاتف خطء"
			: "المفتاح خطء";
		setText.clear();
		setText();
	};
	const handleFormSubmit = async (e) => {
		e.preventDefault();
		try {
			await getPerson();
		} catch (e) {
			handleErrorMessage(e);
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
					type="number"
					required
					label="رقم الهوية"
					value={IdNumber}
					onChange={(e) => {
						setCredentials({ ...credentials, IdNumber: e.target.value });
					}}
				/>
				<CustomInput
					required
					type="number"
					label="رقم الهاتف"
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
						setCredentials({ ...credentials, secretKey: e.target.value });
					}}
				/>
				<p className="error-message red" ref={errorMessageRef}></p>
				<CustomButton text="الدخول" type="submit" />
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
								required
								label="الاسم"
								value={name}
								onChange={(e) => {
									setUser({ ...person, name: e.target.value });
								}}
							/>
							<CustomInput
								required
								label="رقم الهاتف"
								value={remotePhoneNumber}
								onChange={(e) => {
									setUser({ ...person, phoneNumber: e.target.value });
								}}
							/>
						</div>
						<div className="lower-section flex-both">
							<CustomInput
								required
								label="رقم الهوية"
								value={remoteIdNumber}
								onChange={(e) => {
									setUser({ ...person, IdNumber: e.target.value });
								}}
							/>
							<CustomInput
								required
								type="number"
								label="عدد الاطفال"
								defaultValue={(children && children.length) || 0}
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
												_id: new mongoose.Types.ObjectId(),
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
							required
							label="تاريخ الميلاد"
							value={birthDate}
							type="Date"
							onChange={(e) => {
								setUser({ ...person, birthDate: e.target.value });
							}}
						/>
					</div>

					{children.map((child) => {
						return <ChildCard child={child} onChange={changeChildInfo} key={child._id} />;
					})}
					<p className="error-message red" ref={errorMessageRef}></p>
					<CustomButton text="ارسال" type="submit" />
				</>
			) : (
				"!تم ارسال المعلومات بنجاح"
			)}
		</form>
	);
};
export default FormPage;
