import { onNumberInputChange } from "../../utils/utils";
import CustomInput from "../CustomInput/CustomInput.components";

import "./ChildCard.css";
const ChildCard = ({ child, onChange }) => {
	const { name, phoneNumber, birthDate, email } = child;
	return (
		<div className="child-card flex-both">
			<div className="window flex-column">
				<div className="upper-section flex flex-reverse">
					<CustomInput
						required
						label="الاسم"
						value={name}
						onChange={(e) => {
							onChange(child, "name", e.target.value, e);
						}}
					/>
					<CustomInput
						required
						type="number"
						label="رقم الهاتف"
						minlength="10"
						value={phoneNumber}
						onChange={(e) => {
							onNumberInputChange(e);
							onChange(child, "phoneNumber", e.target.value, e);
						}}
					/>
				</div>
				<div className="lower-section flex-content flex-reverse">
					<CustomInput
						required
						label="البريد الالكتروني"
						value={email}
						onChange={(e) => {
							onChange(child, "email", e.target.value);
						}}
					/>
					<CustomInput
						required
						label="تاريخ الميلاد"
						value={birthDate}
						type="Date"
						onChange={(e) => {
							onChange(child, "birthDate", e.target.value.toString());
						}}
					/>
				</div>
			</div>
		</div>
	);
};
export default ChildCard;
