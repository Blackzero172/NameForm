import { useEffect, useState } from "react";
import api from "../../api/api";
import Select from "react-select";
import CustomInput from "../../components/CustomInput/CustomInput.components";

import "./Dashboard.css";
import PersonCard from "../../components/PersonCard/PersonCard";
const Dashboard = () => {
	const [data, setData] = useState([]);
	const [ageFilter, setAge] = useState("");
	const [ageNumber, setAgeLimit] = useState(0);
	const [searchWord, setSearch] = useState("");
	const [filteredData, setFilteredData] = useState([]);
	const ageFilterDict = [">", "<"];
	const selectOptions = [
		{ label: "اكبر من", value: "0" },
		{ label: "اصغر من", value: "1" },
	];

	const getData = async () => {
		const data = await api.get("/people");
		setData(data.data);
		setFilteredData(data.data);
	};
	useEffect(() => {
		getData();
	}, []);
	useEffect(() => {
		setFilteredData(
			data.filter((person) => {
				const searchCondition = person.name.toLowerCase().includes(searchWord.toLowerCase());
				if (ageFilter === ">" && ageNumber > 0 && searchCondition) return person.age > ageNumber;
				else if (ageFilter === "<" && ageNumber > 0 && searchCondition) return person.age < ageNumber;
				else if (searchCondition) {
					return true;
				} else if ((ageFilter === "" || ageNumber === 0) && searchCondition) return true;
				else return false;
			})
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ageFilter, ageNumber, searchWord]);

	return (
		<div className="dashboard flex-column flex-items-end">
			<div className="upper-section">
				<div className="search-bar">
					<CustomInput
						label="بحث"
						placeHolder="...اكتب هنا"
						value={searchWord}
						onChange={(e) => {
							setSearch(e.target.value);
						}}
					/>
				</div>
				<div className="age-btns flex-items-end flex-content-start flex-reverse">
					<div className="right-section flex-items-end flex-content-end">
						<Select
							options={selectOptions}
							placeholder="اختر الاشارة"
							isSearchable={false}
							isRtl
							isClearable
							onChange={(e) => {
								if (e) setAge(ageFilterDict[e.value]);
								else setAge("");
							}}
						/>
						<CustomInput
							placeHolder="...اكتب هنا"
							label=":العمر"
							type="number"
							onChange={(e) => {
								if (e.target.value > 100) {
									e.target.value = 100;
								} else if (e.target.value < 0) {
									e.target.value = 0;
								} else if (e.target.value === "") setAgeLimit(0);
								else setAgeLimit(parseInt(e.target.value));
							}}
						/>
					</div>
					<div className="left-section">
						<h2>{filteredData.length}:المجموع</h2>
					</div>
				</div>
			</div>
			<div className="lower-section">
				<div className="data-grid">
					{filteredData.map((person) => {
						return <PersonCard person={person} key={person._id} />;
					})}
				</div>
			</div>
		</div>
	);
};
export default Dashboard;
