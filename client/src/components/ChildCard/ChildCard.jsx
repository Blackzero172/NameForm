import { onNumberInputChange } from "../../utils/utils";
import CustomInput from "../CustomInput/CustomInput.components";

import "./ChildCard.css";
const ChildCard = ({ child, onChange, onBlur }) => {
	const { name, phoneNumber, birthDate } = child;
	return (
		<div className="child-card flex-both">
			<div className="window flex-column">
				<div className="upper-section flex">
					<CustomInput
						required
						type="number"
						label="رقم الهاتف"
						value={phoneNumber}
						onChange={(e) => {
							onNumberInputChange(e);
							onChange(child, "phoneNumber", e.target.value, e);
						}}
					/>
					<CustomInput
						required
						label="الاسم"
						value={name}
						onChange={(e) => {
							onChange(child, "name", e.target.value, e);
						}}
					/>
				</div>
				<div className="lower-section flex-content">
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
