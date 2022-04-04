import moment from "moment";
import "./PersonCard.css";
const PersonCard = ({ person }) => {
	return (
		<div className="person-card flex-column flex-content-between" dir="rtl">
			<div className="upper-section flex flex-evenly">
				<p>الاسم : {person.name}</p>
				{person.phoneNumber && <p>رقم الهاتف : {person.phoneNumber}</p>}
				{person.parentName && !person.phoneNumber && <p>اسم الوالد/ة : </p>}
			</div>
			<div className="lower-section flex flex-evenly">
				<p>العمر : {Number(person.age).toFixed(1)}</p>
				<p>تاريخ الميلاد : {moment(person.birthDate).format("DD/MM/YYYY")}</p>
			</div>
			{person.parentName && person.phoneNumber && (
				<div className="parent-container flex-content">
					<p>اسم الوالد/ة :{person.parentName} </p>
				</div>
			)}
		</div>
	);
};
export default PersonCard;
