import React, { useEffect, useRef } from "react";
import "./CustomInput.styles.css";
import moment from "moment";
import { isMobilePhone, isEmail } from "validator";
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
	minLength,
	stateSetValid,
	duplicate,
}) => {
	const errorMessageRef = useRef();
	const inputRef = useRef();
	const checkValid = () => {
		if (stateSetValid) {
			if (!type) {
				const arRegex = /[\u0600-\u06FF]/g;
				if (!arRegex.test(value) && value && value !== "") {
					stateSetValid(false);
					errorMessageRef.current.innerText = "الاسم مسموح فقط في العربية";
					inputRef.current.classList.add("error");
				} else if ((!value || value === "") && required) {
					stateSetValid(false);
					inputRef.current.classList.add("error");
					errorMessageRef.current.innerText = "";
				} else {
					errorMessageRef.current.innerText = "";
					inputRef.current.classList.remove("error");
					stateSetValid(true);
				}
			} else if (type === "number") {
				if (!isMobilePhone(value || "", "he-IL") && value) {
					errorMessageRef.current.innerText = "رقم الهاتف غير صحيح";
					inputRef.current.classList.add("error");
					stateSetValid(false);
				} else if ((!value || value === "") && required) {
					stateSetValid(false);
					inputRef.current.classList.add("error");
					errorMessageRef.current.innerText = "";
				} else if (duplicate) {
					errorMessageRef.current.innerText = "لا يمكن تكرار رقم الهاتف";
					inputRef.current.classList.add("error");
				} else {
					errorMessageRef.current.innerText = "";
					inputRef.current.classList.remove("error");
					stateSetValid(true);
				}
			} else if (type === "Date") {
				console.log(moment(value).diff(moment(), "years"));
				if (
					(moment(value).diff(moment(), "days") === 0 || moment(value).diff(moment(), "years") < -120) &&
					value
				) {
					errorMessageRef.current.innerText = "تاريخ الميلاد غير صحيح";
					inputRef.current.classList.add("error");
					stateSetValid(false);
				} else if ((!value || value === "") && required) {
					stateSetValid(false);
					inputRef.current.classList.add("error");
					errorMessageRef.current.innerText = "";
				} else {
					errorMessageRef.current.innerText = "";
					inputRef.current.classList.remove("error");
					stateSetValid(true);
				}
			} else if (type === "email") {
				if (!isEmail(value || "") && value) {
					errorMessageRef.current.innerText = "البريد الالكتروني غير صحيح";
					inputRef.current.classList.add("error");
					stateSetValid(false);
				} else if ((!value || value === "") && required) {
					stateSetValid(false);
					inputRef.current.classList.add("error");
					errorMessageRef.current.innerText = "";
				} else {
					errorMessageRef.current.innerText = "";
					inputRef.current.classList.remove("error");
					stateSetValid(true);
				}
			}
		}
	};
	useEffect(() => {
		if (stateSetValid) {
			checkValid();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value]);
	useEffect(() => {
		if (stateSetValid) {
			checkValid();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="input-container flex-column flex-items">
			{!required ? (
				<label htmlFor={name}>{label}</label>
			) : (
				<label htmlFor={name}>
					{label} <span className="red">(الزامي)</span>
				</label>
			)}
			<input
				ref={inputRef}
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
				minLength={minLength}
			/>
			<p className="red" ref={errorMessageRef}></p>
		</div>
	);
};
export default CustomInput;
