import { useEffect, useRef, useState } from "react";
import api from "../../api/api";
import Select from "react-select";
import CustomInput from "../../components/CustomInput/CustomInput.components";

import "./Dashboard.css";
const Dashboard = () => {
	const [data, setData] = useState([]);
	const [ageFilter, setAge] = useState(0);
	const btnContainerRef = useRef();
	const selectOptions = [
		{ label: "اكبر من", value: "1" },
		{ label: "اصغر من", value: "2" },
		{ label: "اكبر او يساوي", value: "4" },
		{ label: "اصغر او يساوي", value: "5" },
	];
	const onFilterSelect = (e) => {
		const children = Array.from(btnContainerRef.current.children);
		children.forEach((child) => {
			if (child.innerText !== e.target.innerText) child.classList.remove("selected");
			else child.classList.add("selected");
		});
		setAge(e.target.innerText);
	};
	const getData = async () => {
		const data = await api.get("/people/true");
		setData(data.data);
	};
	useEffect(() => {
		getData();
	}, []);
	return (
		<div className="dashboard flex-column flex-items-end">
			<div className="upper-section">
				<div className="search-bar">
					<CustomInput label="بحث" placeHolder="...اكتب هنا" />
				</div>
				<div className="age-btns flex-items-end flex-content-start flex-reverse">
					<div className="right-section flex-items-end flex-content-end">
						<Select
							options={selectOptions}
							placeholder="اختر الاشارة"
							isSearchable={false}
							isRtl
							isClearable
						/>
						<CustomInput
							placeHolder="...اكتب هنا"
							label=":العمر"
							type="number"
							onChange={(e) => {
								if (e.target.value > 100) {
									e.target.value = 100;
								}
							}}
						/>
					</div>
					<div className="left-section">
						<h2>{"3"}:المجموع</h2>
					</div>
				</div>
			</div>
			<div className="lower-section">
				<div className="data-grid"></div>
			</div>
		</div>
	);
};
export default Dashboard;
