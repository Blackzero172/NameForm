import { useEffect, useState } from "react";
import { onNumberInputChange } from "../../utils/utils";
import CustomInput from "../CustomInput/CustomInput.components";
import CustomRadio from "../CustomRadio/CustomRadio";

import "./ChildCard.css";
const ChildCard = ({ child, onChange, index, stateSetValid }) => {
	const [inputValid, setValid] = useState([true, true, true, true]);
	const { name, phoneNumber, birthDate, email, gender } = child;
	useEffect(() => {
		stateSetValid(inputValid.filter((input) => !input) < 1);
	}, [inputValid]);
	return (
		<div className="child-card flex-both">
			<div className="window flex-column flex-items">
				<h2>تفاصيل الطفل</h2>
				<div className="form-grid">
					<CustomInput
						isValid={inputValid[0]}
						stateSetValid={(valid) => {
							setValid([valid, ...inputValid.slice(1)]);
						}}
						required
						label="الاسم"
						value={name}
						onChange={(e) => {
							onChange(child, "name", e.target.value, e);
						}}
					/>
					<CustomInput
						isValid={inputValid[1]}
						stateSetValid={(valid) => {
							setValid([inputValid[0], valid, ...inputValid.slice(2)]);
						}}
						type="number"
						label="رقم الهاتف"
						minlength="10"
						value={phoneNumber}
						onChange={(e) => {
							onNumberInputChange(e);
							onChange(child, "phoneNumber", e.target.value, e);
						}}
					/>

					<CustomInput
						isValid={inputValid[2]}
						stateSetValid={(valid) => {
							setValid([...inputValid.slice(0, 2), valid, ...inputValid.slice(3)]);
						}}
						label="البريد الالكتروني"
						value={email}
						onChange={(e) => {
							onChange(child, "email", e.target.value);
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
							onChange(child, "birthDate", e.target.value.toString());
						}}
					/>
					<div className="select flex-both flex-column">
						<label>
							النوع <span className="red">(الزامي)</span>
						</label>
						<div className="gender-select">
							<CustomRadio
								required
								name={`gender-select-${index}`}
								label="ذكر"
								value={gender === "male"}
								onChange={() => {
									onChange(child, "gender", "male");
								}}
							/>
							<CustomRadio
								required
								name={`gender-select-${index}`}
								label="انثى"
								value={gender === "female"}
								onChange={() => {
									onChange(child, "gender", "female");
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default ChildCard;
