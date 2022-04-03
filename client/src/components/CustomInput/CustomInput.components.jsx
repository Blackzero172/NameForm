import React from "react";
import "./CustomInput.styles.css";
const CustomInput = ({
	type,
	onChange,
	placeHolder,
	label,
	name,
	required,
	value,
	checked,
	onBlur,
	defaultValue,
}) => {
	return (
		<div className="input-container flex-column flex-items">
			<label htmlFor={name}>{label}</label>
			<input
				onBlur={onBlur}
				type={type}
				onChange={onChange}
				placeholder={placeHolder}
				id={name}
				onClick={(e) => e.stopPropagation()}
				required={required}
				value={value}
				checked={checked}
				defaultValue={defaultValue}
			/>
		</div>
	);
};
export default CustomInput;
