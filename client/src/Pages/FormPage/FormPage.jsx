import { debounce } from "debounce";
import moment from "moment";
import mongoose from "mongoose";
import { useRef, useState } from "react";
import { isMobilePhone, isEmail } from "validator";
import ChildCard from "../../components/ChildCard/ChildCard";
import CustomButton from "../../components/CustomButton/CustomButton.components";
import CustomInput from "../../components/CustomInput/CustomInput.components";

import "./FormPage.css";
import CustomRadio from "../../components/CustomRadio/CustomRadio";
const FormPage = ({ setCredentials, credentials, getPerson, person, setUser, updatePerson }) => {
	const [personCopy, setCopy] = useState({});
	const [isMarried, setMarried] = useState("");
	const { email, phoneNumber, secretKey } = credentials;
	const { name, children, birthDate, spouse, gender } = person;
	const remoteEmail = person.email;
	const remotePhoneNumber = person.phoneNumber;
	const errorMessageRef = useRef();
	const setText = debounce(() => {
		errorMessageRef.current.innerText = "";
	}, 4000);
	const handleErrorMessage = (e) => {
		console.log(e.message);
		errorMessageRef.current.innerText = e.message.includes("Email")
			? "البريد الالكتروني غير صحيح"
			: e.message.includes("Phone Number")
			? "رقم الهاتف غير صحيح"
			: e.message.includes("Wrong Key")
			? "المفتاح غير صحيح"
			: e.message;
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
					required
					label="البريد الالكتروني"
					value={email}
					onChange={(e) => {
						setCredentials({ ...credentials, email: e.target.value });
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
				const arRegex = /^[\u0621-\u064A\040]+$/;
				try {
					if (
						arRegex.test(name) &&
						moment().format("yyyy-MM-DD") !== moment(birthDate).format("yyyy-MM-DD") &&
						isMobilePhone(phoneNumber, "he-IL") &&
						isEmail(email) &&
						phoneNumber !== spouse.phoneNumber
					) {
						const filter = children.filter(
							(child) =>
								moment().format("yyyy-MM-DD") === moment(child.birthDate).format("yyyy-MM-DD") &&
								!arRegex.test(child.name)
						);
						if (filter.length < 1) {
							const response = await updatePerson();
							setCopy(response);
						} else {
							children.forEach((child) => {
								if (moment().format("yyyy-MM-DD") === moment(child.birthDate).format("yyyy-MM-DD"))
									throw new Error("تاريخ الميلاد غير صحيح");
								else if (!arRegex.test(child.name)) throw new Error("الاسم مسموح فقط في العربية");
							});
						}
					} else {
						if (moment().format("yyyy-MM-DD") === moment(birthDate).format("yyyy-MM-DD"))
							throw new Error("تاريخ الميلاد غير صحيح");
						else if (!isMobilePhone(phoneNumber, "he-IL")) throw new Error("رقم الهاتف غير صحيح");
						else if (!isEmail(email)) throw new Error("البريد الالكتروني غير صحيح");
						else if (!arRegex.test(name)) throw new Error("الاسم مسموح فقط في العربية");
						else if (phoneNumber === spouse.phoneNumber) throw new Error("رقم الهاتف لا يمكن تكراره");
					}
				} catch (e) {
					handleErrorMessage(e);
				}
			}}
		>
			{!personCopy.name ? (
				<>
					<div className="window flex-both flex-column">
						<h2>التفاصيل الشخصية</h2>
						<div className="form-grid flex-both">
							<CustomInput
								required
								label=" الاسم الثلاثي"
								value={name}
								minLength={5}
								onChange={(e) => {
									setUser({ ...person, name: e.target.value });
								}}
							/>
							<CustomInput
								required
								type="number"
								label="رقم الهاتف"
								minlength="10"
								value={remotePhoneNumber}
								onChange={(e) => {
									setUser({ ...person, phoneNumber: e.target.value });
								}}
							/>
							<CustomInput
								required
								label="البريد الالكتروني"
								value={remoteEmail}
								onChange={(e) => {
									setUser({ ...person, email: e.target.value });
								}}
							/>
							<CustomInput
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
												parentName: name,
											});
										}
										setUser({
											...person,
											children,
										});
									}
								}}
							/>
							<CustomInput
								required
								label="تاريخ الميلاد"
								value={birthDate}
								type="Date"
								onChange={(e) => {
									setUser({ ...person, birthDate: e.target.value });
								}}
							/>
							<div className="select flex-both flex-column">
								<label>
									النوع <span className="red">(الزامي)</span>
								</label>
								<div className="gender-select">
									<CustomRadio
										required
										name="gender-select"
										label="ذكر"
										value={gender === "male"}
										onChange={() => {
											setUser({ ...person, gender: "male", spouse: { ...spouse, gender: "female" } });
										}}
									/>
									<CustomRadio
										name="gender-select"
										label="انثى"
										value={gender === "female"}
										onChange={() => {
											setUser({ ...person, gender: "female", spouse: { ...spouse, gender: "male" } });
										}}
									/>
								</div>
							</div>
						</div>
						<div className="married-select">
							<label>
								متزوج <span className="red">(الزامي)</span>
							</label>
							<CustomRadio
								required
								name="married-select"
								label="نعم"
								value={isMarried && isMarried !== ""}
								onChange={() => {
									setMarried(true);
								}}
							/>
							<CustomRadio
								name="married-select"
								label="لا"
								value={!isMarried && isMarried !== ""}
								onChange={() => {
									setMarried(false);
								}}
							/>
						</div>
					</div>
					{isMarried && (
						<div className="window flex-both flex-column">
							<h2>التفاصيل الزوج/ة</h2>
							<div className="form-grid flex-both">
								<CustomInput
									required
									label="الاسم الثلاثي"
									value={spouse.name}
									minLength={5}
									onChange={(e) => {
										setUser({ ...person, spouse: { ...spouse, name: e.target.value } });
									}}
								/>
								<CustomInput
									required
									label="رقم الهاتف"
									minlength="10"
									value={spouse.phoneNumber}
									onChange={(e) => {
										setUser({ ...person, spouse: { ...spouse, phoneNumber: e.target.value } });
									}}
								/>
								<CustomInput
									type="email"
									required
									label="البريد الالكتروني"
									value={spouse.email}
									onChange={(e) => {
										setUser({ ...person, spouse: { ...spouse, email: e.target.value } });
									}}
								/>
								<CustomInput
									required
									label="تاريخ الميلاد"
									value={spouse.birthDate}
									type="Date"
									onChange={(e) => {
										setUser({ ...person, spouse: { ...spouse, birthDate: e.target.value } });
									}}
								/>
							</div>
						</div>
					)}
					{children.map((child, index) => {
						return <ChildCard child={child} onChange={changeChildInfo} key={child._id} index={index} />;
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
