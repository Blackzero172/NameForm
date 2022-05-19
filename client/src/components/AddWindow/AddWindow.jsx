import mongoose from "mongoose";
import { useState } from "react";
import ChildCard from "../ChildCard/ChildCard";
import CustomButton from "../CustomButton/CustomButton.components";
import CustomInput from "../CustomInput/CustomInput.components";
import CustomRadio from "../CustomRadio/CustomRadio";
import "./AddWindow.css";

const AddWindow = ({ person, updatePerson, editPerson, closeWindow }) => {
	const [stepCounter, setStep] = useState(0);
	const { name, phoneNumber, email, children, spouse, gender, birthDate } = person;
	const [isMarried, setMarried] = useState("");
	const condition = 0 + isMarried + children.length > 0;
	const handleStepSubmit = (e) => {
		console.log(condition);
		e.stopPropagation();
		e.preventDefault();
		if (stepCounter < condition) setStep(stepCounter + 1);
		else editPerson();
	};
	const changeChildInfo = (child, prop, value) => {
		const childrenCopy = [...children];
		const childCopy = childrenCopy[childrenCopy.indexOf(child)];
		childCopy[prop] = value;
		updatePerson({ ...person, children: childrenCopy });
	};
	return (
		<form className="add-window flex-both" onSubmit={handleStepSubmit}>
			<div className="window flex-column">
				<div className="cancel-btn flex-both" onClick={closeWindow}>
					{/* <i className="fas fa-times"></i> */}
					{condition}
				</div>
				<h2>
					{stepCounter === 0 ? "التفاصيل الشخصية" : stepCounter === 1 && isMarried ? " التفاصيل الزوج/ة" : ""}
				</h2>
				<div className="inputs-container">
					{stepCounter === 0 && (
						<>
							<CustomInput
								required
								label=" الاسم الثلاثي"
								value={name}
								minLength={5}
								onChange={(e) => {
									updatePerson({ ...person, name: e.target.value });
								}}
							/>

							<CustomInput
								required
								type="number"
								label="رقم الهاتف"
								minLength="10"
								value={phoneNumber}
								onChange={(e) => {
									updatePerson({ ...person, phoneNumber: e.target.value });
								}}
							/>
							<CustomInput
								required
								type="email"
								label="البريد الالكتروني"
								value={email}
								onChange={(e) => {
									updatePerson({ ...person, email: e.target.value });
								}}
							/>
							<CustomInput
								required
								label="تاريخ الميلاد"
								value={birthDate}
								type="Date"
								onChange={(e) => {
									updatePerson({ ...person, birthDate: e.target.value });
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
												parent: person._id,
											});
										}
										updatePerson({
											...person,
											children,
										});
									}
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
											updatePerson({ ...person, gender: "male", spouse: { ...spouse, gender: "female" } });
										}}
									/>
									<CustomRadio
										name="gender-select"
										label="انثى"
										value={gender === "female"}
										onChange={() => {
											updatePerson({ ...person, gender: "female", spouse: { ...spouse, gender: "male" } });
										}}
									/>
								</div>
							</div>
							<div className="married-select flex-both flex-column">
								<label>
									متزوج <span className="red">(الزامي)</span>
								</label>
								<CustomRadio
									required
									name="married-select"
									label="نعم"
									value={isMarried === true}
									onChange={() => {
										setMarried(true);
										if (!spouse) updatePerson({ ...person, spouse: { _id: new mongoose.Types.ObjectId() } });
									}}
								/>
								<CustomRadio
									name="married-select"
									label="لا"
									value={isMarried === false}
									onChange={() => {
										setMarried(false);
										if (spouse)
											updatePerson({
												...person,
												spouse: null,
											});
									}}
								/>
							</div>
						</>
					)}
					{stepCounter === 1 && isMarried && (
						<>
							<CustomInput
								required
								label="الاسم الثلاثي"
								value={spouse.name}
								minLength={5}
								onChange={(e) => {
									updatePerson({ ...person, spouse: { ...spouse, name: e.target.value } });
								}}
							/>
							<CustomInput
								required
								label="رقم الهاتف"
								minlength="10"
								value={spouse.phoneNumber}
								onChange={(e) => {
									updatePerson({ ...person, spouse: { ...spouse, phoneNumber: e.target.value } });
								}}
							/>
							<CustomInput
								type="email"
								required
								label="البريد الالكتروني"
								value={spouse.email}
								onChange={(e) => {
									updatePerson({ ...person, spouse: { ...spouse, email: e.target.value } });
								}}
							/>
							<CustomInput
								required
								label="تاريخ الميلاد"
								value={spouse.birthDate}
								type="Date"
								onChange={(e) => {
									updatePerson({ ...person, spouse: { ...spouse, birthDate: e.target.value } });
								}}
							/>
						</>
					)}
					{stepCounter === condition && (
						<>
							{person.children.map((child, i) => {
								return <ChildCard child={child} onChange={changeChildInfo} index={i} />;
							})}
						</>
					)}
				</div>
				<div className="btn-container">
					<CustomButton
						text={stepCounter < condition ? "التالي" : "ارسال"}
						type="submit"
						classes="next-btn"
					/>
					{stepCounter > 0 && (
						<CustomButton
							text="السابق"
							onClick={() => {
								setStep(stepCounter - 1);
							}}
							classes="prev-btn"
						/>
					)}
				</div>
			</div>
		</form>
	);
};
export default AddWindow;
