import { useEffect, useState } from "react";
import api from "../../api/api";
import CustomInput from "../../components/CustomInput/CustomInput.components";

import "./Dashboard.css";
import PersonCard from "../../components/PersonCard/PersonCard";
import Select from "react-select";
const Dashboard = () => {
	const [data, setData] = useState([]);
	const [ageFilter, setAge] = useState("");
	const [ageNumber, setAgeLimit] = useState(0);
	const [genderFilter, setGender] = useState("");
	const [searchWord, setSearch] = useState("");
	const [filteredData, setFilteredData] = useState([]);

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
			data
				.filter((person) => {
					if (ageFilter === ">" && ageNumber > 0) return person.age > ageNumber;
					else if (ageFilter === "<" && ageNumber > 0) return person.age < ageNumber;
					else if (ageFilter === "" || ageNumber === 0) return true;
					else return false;
				})
				.filter((person) => {
					const searchCondition = person.name.toLowerCase().includes(searchWord.toLowerCase());
					if ((searchCondition && searchWord !== "") || searchWord === "") return true;
					else return false;
				})
				.filter((person) => {
					const searchCondition = person.gender === genderFilter;
					if ((searchCondition && genderFilter !== "") || genderFilter === "") return true;
					else return false;
				})
		);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ageFilter, ageNumber, searchWord, genderFilter]);

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
						<CustomInput
							placeHolder="...اكتب هنا"
							label="العمر"
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
						<div className="select flex-both flex-column">
							<div className="gender-select">
								<Select
									placeholder="اخترالاشارة"
									options={[
										{ label: "اكبر من", value: ">" },
										{ label: "اصغر من", value: "<" },
									]}
									onChange={(e) => {
										if (e) setAge(e.value);
										else setAge("");
									}}
									isClearable
									isRtl
									isSearchable={false}
									className="select-container gender-select-container"
									styles={{
										control: (provided, state) => ({
											...provided,
											textIndent: "1.5rem",
										}),
									}}
								/>
							</div>
						</div>
						<div className="select flex-both flex-column">
							<label>الجنس</label>
							<div className="gender-select">
								<Select
									placeholder="اختر الجنس"
									options={[
										{ label: "ذكر", value: "male" },
										{ label: "انثى", value: "female" },
									]}
									onChange={(e) => {
										if (e) setGender(e.value);
										else setGender("");
									}}
									isClearable
									isRtl
									isSearchable={false}
									className="select-container"
									styles={{
										control: (provided, state) => ({
											...provided,
											textIndent: "1.5rem",
										}),
									}}
								/>
							</div>
						</div>
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
