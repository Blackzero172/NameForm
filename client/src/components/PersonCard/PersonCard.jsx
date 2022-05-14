import moment from "moment";
import "./PersonCard.css";
const PersonCard = ({ person }) => {
	return (
		<div className="person-card " dir="rtl">
			<p>الاسم : {person.name}</p>
			{person.phoneNumber && <p>رقم الهاتف : {person.phoneNumber}</p>}
			{person.parent && !person.phoneNumber && <p>اسم الوالد/ة :{person.parent.name} </p>}
			<p>العمر : {Number(person.age).toFixed(0)}</p>
			<p>تاريخ الميلاد : {moment(person.birthDate).format("DD/MM/YYYY")}</p>
			{person.parent && person.phoneNumber && <p>اسم الوالد/ة :{person.parent.name} </p>}
			{person.spouse && <p>اسم الزوج/ة : {person.spouse.name}</p>}
			<p>النوع : {person.gender === "male" ? "ذكر" : "انثى"}</p>
		</div>
	);
};
export default PersonCard;
