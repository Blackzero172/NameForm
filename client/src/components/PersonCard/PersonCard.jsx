import moment from "moment";
import "./PersonCard.css";
const PersonCard = ({ person }) => {
	return (
		<div className="person-card " dir="rtl">
			<p>الاسم : {person.name}</p>
			{person.phoneNumber && <p>رقم الهاتف : {person.phoneNumber}</p>}
			{person.parentName && !person.phoneNumber && <p>اسم الوالد/ة :{person.parentName} </p>}
			<p>العمر : {Number(person.age).toFixed(1)}</p>
			<p>تاريخ الميلاد : {moment(person.birthDate).format("DD/MM/YYYY")}</p>
			{person.parentName && person.phoneNumber && <p>اسم الوالد/ة :{person.parentName} </p>}
			{person.spouse && <p>اسم الزوج/ة : {person.spouse.name}</p>}
			<p>الجنس : {person.gender === "male" ? "ذكر" : "انثى"}</p>
		</div>
	);
};
export default PersonCard;
