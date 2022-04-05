import React from "react";
import "./CustomRadio.css";
const CustomRadio = ({ onChange, label, name, required, value }) => {
	return (
		<div className="input-container flex-both flex-reverse">
			<label htmlFor={name}>{label}</label>
			<input
				type="radio"
				onChange={onChange}
				name={name}
				onClick={(e) => e.stopPropagation()}
				required={required}
				checked={value}
			/>
		</div>
	);
};
export default CustomRadio;
