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
	minlength,
}) => {
	return (
		<div className="input-container flex-column flex-items">
			{!required ? (
				<label htmlFor={name}>{label}</label>
			) : (
				<label htmlFor={name}>
					{label} <span className="red">*</span>
				</label>
			)}
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
				minlength={minlength}
			/>
		</div>
	);
};
export default CustomInput;
