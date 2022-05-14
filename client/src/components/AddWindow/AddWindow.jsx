import { useState } from "react";
import CustomButton from "../CustomButton/CustomButton.components";
import CustomInput from "../CustomInput/CustomInput.components";
import "./AddWindow.css";

const AddWindow = () => {
	const [stepCounter, setStep] = useState(0);
	const [isMarried, setMarried] = useState(false);
	const [childrenCount, setChildren] = useState(0);
	return (
		<form className="add-window flex-both">
			<div className="window flex-column flex-column">
				<div className="inputs-container">
					{stepCounter === 0 && (
						<>
							<CustomInput label="الاسم الثلاثي" />
							<CustomInput label="رقم الهاتف" />
						</>
					)}
				</div>
				<div className="btn-container">
					<CustomButton
						text="التالي"
						onClick={() => {
							setStep(stepCounter + 1);
						}}
					/>
					{stepCounter > 0 && (
						<CustomButton
							text="السابق"
							onClick={() => {
								setStep(stepCounter - 1);
							}}
						/>
					)}
				</div>
			</div>
		</form>
	);
};
export default AddWindow;
