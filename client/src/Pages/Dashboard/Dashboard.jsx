import CustomInput from "../../components/CustomInput/CustomInput.components";

import "./Dashboard.css";
const Dashboard = () => {
	return (
		<div className="dashboard">
			<div className="search-bar">
				<CustomInput label="بحث" placeHolder="...اكتب هنا" />
			</div>
		</div>
	);
};
export default Dashboard;
