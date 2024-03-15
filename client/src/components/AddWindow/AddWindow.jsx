import mongoose from "mongoose";
import { useEffect, useState } from "react";
import ChildCard from "../ChildCard/ChildCard";
import CustomButton from "../CustomButton/CustomButton.components";
import CustomInput from "../CustomInput/CustomInput.components";
import CustomRadio from "../CustomRadio/CustomRadio";
import "./AddWindow.css";

const AddWindow = ({ person, updatePerson, editPerson, closeWindow, isFixed, getData }) => {
	const [stepCounter, setStep] = useState(0);
	const { name, phoneNumber, email, children, spouse, gender, birthDate } = person;
	const [isMarried, setMarried] = useState();
	useEffect(() => {
		if (spouse.name) setMarried(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const [inputValid, setValid] = useState([true, true, true, true]);
	const condition = 0 + Number(isMarried) + Number(children.length > 0);
	const handleStepSubmit = async (e) => {
		try {
			e.stopPropagation();
			e.preventDefault();
			if (stepCounter < condition) setStep(stepCounter + 1);
			else {
				const status = await editPerson();
				if (status === 200) closeWindow();
				getData();
			}
		} catch (e) {
			console.log(e);
		}
	};
	const changeChildInfo = (child, prop, value) => {
		const childrenCopy = [...children];

		const childCopy = childrenCopy[childrenCopy.indexOf(child)];

		childCopy[prop] = value;
		updatePerson({ ...person, children: childrenCopy });
	};
	return (
		<form className={`add-window flex-both ${isFixed ? "form-window" : ""} `} onSubmit={handleStepSubmit}>
			<div className="window flex-column">
				<div className="cancel-btn flex-both" onClick={closeWindow}>
					<i className="fas fa-times"></i>
				</div>
				<h2>
					{stepCounter === 0 ? "التفاصيل الشخصية" : stepCounter === 1 && isMarried ? " التفاصيل الزوج/ة" : ""}
				</h2>
				<div className="inputs-container">
					{stepCounter === 0 && (
						<>
							<CustomInput
								isValid={inputValid[0]}
								stateSetValid={(valid) => {
									setValid([valid, ...inputValid.slice(1)]);
								}}
								required
								label=" الاسم الثلاثي"
								value={name}
								minLength={5}
								onChange={(e) => {
									updatePerson({ ...person, name: e.target.value });
								}}
							/>

							<CustomInput
								isValid={inputValid[1]}
								stateSetValid={(valid) => {
									setValid([inputValid[0], valid, ...inputValid.slice(2)]);
								}}
								required={!person.parent}
								type="number"
								label="رقم الهاتف"
								minLength="10"
								value={phoneNumber}
								onChange={(e) => {
									updatePerson({ ...person, phoneNumber: e.target.value });
								}}
							/>
							<CustomInput
								isValid={inputValid[2]}
								stateSetValid={(valid) => {
									setValid([...inputValid.slice(0, 2), valid, ...inputValid.slice(3)]);
								}}
								required={!person.parent}
								type="email"
								label="البريد الالكتروني"
								value={email}
								onChange={(e) => {
									updatePerson({ ...person, email: e.target.value });
								}}
							/>
							<CustomInput
								isValid={inputValid[3]}
								stateSetValid={(valid) => {
									setValid([...inputValid.slice(0, 3), valid]);
								}}
								required
								label="تاريخ الميلاد"
								value={birthDate}
								type="Date"
								onChange={(e) => {
									updatePerson({ ...person, birthDate: e.target.value });
								}}
							/>
							{(!person.parent || person.age > 18) && (
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
											const children = [...person.children];
											const diff = e.target.value - children.length;
											if (diff < 0) {
												for (let i = 0; i < Math.abs(diff); i++) {
													children.pop();
												}
											} else
												for (let i = 0; i < diff; i++) {
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
							)}
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
							{(!person.parent || person.age > 18) && (
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
											if (!spouse)
												updatePerson({
													...person,
													spouse: {
														_id: new mongoose.Types.ObjectId(),
														gender: gender === "male" ? "female" : "male",
													},
												});
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
													spouse: {},
												});
										}}
									/>
								</div>
							)}
						</>
					)}
					{stepCounter === 1 && isMarried && (
						<>
							<CustomInput
								isValid={inputValid[0]}
								stateSetValid={(valid) => {
									setValid([valid, ...inputValid.slice(1)]);
								}}
								required
								label="الاسم الثلاثي"
								value={spouse.name}
								minLength={5}
								onChange={(e) => {
									updatePerson({ ...person, spouse: { ...spouse, name: e.target.value } });
								}}
							/>
							<CustomInput
								isValid={inputValid[1]}
								stateSetValid={(valid) => {
									setValid([inputValid[0], valid, ...inputValid.slice(2)]);
								}}
								required
								duplicate={phoneNumber === spouse.phoneNumber}
								label="رقم الهاتف"
								minlength="10"
								type="number"
								value={spouse.phoneNumber}
								onChange={(e) => {
									updatePerson({ ...person, spouse: { ...spouse, phoneNumber: e.target.value } });
								}}
							/>
							<CustomInput
								isValid={inputValid[2]}
								stateSetValid={(valid) => {
									setValid([...inputValid.slice(0, 2), valid, ...inputValid.slice(3)]);
								}}
								type="email"
								required
								label="البريد الالكتروني"
								value={spouse.email}
								onChange={(e) => {
									updatePerson({ ...person, spouse: { ...spouse, email: e.target.value } });
								}}
							/>
							<CustomInput
								isValid={inputValid[3]}
								stateSetValid={(valid) => {
									setValid([...inputValid.slice(0, 3), valid]);
								}}
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
								return (
									<ChildCard
										child={child}
										onChange={changeChildInfo}
										index={i}
										stateSetValid={(valid) => {
											const inputCopy = [...inputValid];
											inputCopy[i] = valid;
											setValid(inputCopy);
										}}
									/>
								);
							})}
						</>
					)}
				</div>
				<div className="btn-container">
					<CustomButton
						text={stepCounter < condition ? "التالي" : "ارسال"}
						type="submit"
						classes="next-btn"
						disabled={inputValid.filter((input) => !input).length > 0}
					/>
					{stepCounter > 0 && (
						<CustomButton
							text="السابق"
							onClick={() => {
								setStep(stepCounter - 1);
								setValid([]);
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
