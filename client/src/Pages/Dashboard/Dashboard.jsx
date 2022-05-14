import { useEffect, useState } from "react";
import moment from "moment";
import api from "../../api/api";
import CustomInput from "../../components/CustomInput/CustomInput.components";

import "./Dashboard.css";
import PersonCard from "../../components/PersonCard/PersonCard";
import Select from "react-select";
import CustomButton from "../../components/CustomButton/CustomButton.components";
import AddWindow from "../../components/AddWindow/AddWindow";
const Dashboard = () => {
	const [data, setData] = useState([]);
	const [ageNumber, setAgeLimit] = useState(["0", "0"]);
	const [genderFilter, setGender] = useState("");
	const [searchWord, setSearch] = useState("");
	const [filteredData, setFilteredData] = useState([]);
	const [addWindow, showHideWindow] = useState(false);
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
					if (ageNumber[0] !== "0" && ageNumber[0] !== "" && ageNumber[1] !== "0" && ageNumber[1] !== "") {
						return person.age < ageNumber[0] && person.age > ageNumber[1];
					} else if (ageNumber[0] !== "0" && ageNumber[0] !== "") {
						return person.age < ageNumber[0];
					} else if (ageNumber[1] !== "0" && ageNumber[1] !== "") {
						return person.age > ageNumber[1];
					} else return true;
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
	}, [ageNumber, searchWord, genderFilter]);

	return (
		<>
			{addWindow && <AddWindow />}
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
							<div className="age-select">
								<CustomInput
									label="اصغر من"
									placeHolder="اكتب العمر"
									value={ageNumber[0]}
									onChange={(e) => {
										setAgeLimit([e.target.value, ageNumber[1]]);
									}}
									type="number"
								/>
								<p>-</p>
								<CustomInput
									label="اكبر من"
									placeHolder="اكتب العمر"
									value={ageNumber[1]}
									onChange={(e) => {
										setAgeLimit([ageNumber[0], e.target.value]);
									}}
									type="number"
								/>
							</div>
							<div className="select flex-both flex-column">
								<label>النوع</label>
								<div className="gender-select">
									<Select
										placeholder="اختر النوع"
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
							<h3 className="print">{moment().format("DD/MM/yyyy")}</h3>
							<h2>{filteredData.length}:المجموع</h2>
						</div>
					</div>
				</div>
				<div className="lower-section">
					<div className="btn-container flex-content">
						<CustomButton
							text=" اضافة"
							onClick={() => {
								showHideWindow(true);
							}}
						>
							<i className="fas fa-plus"></i>
						</CustomButton>
					</div>
					<div className="data-grid">
						{filteredData.map((person) => {
							return <PersonCard person={person} key={person._id} />;
						})}
					</div>
				</div>
			</div>
		</>
	);
};
export default Dashboard;
