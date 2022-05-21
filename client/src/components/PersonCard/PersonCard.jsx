import moment from "moment";
import CustomButton from "../CustomButton/CustomButton.components";
import "./PersonCard.css";
const PersonCard = ({ person, updatePerson }) => {
	return (
		<div className="person-card flex-column" dir="rtl">
			<div className="info-container">
				<p>الاسم : {person.name}</p>
				{person.phoneNumber && <p>رقم الهاتف : {person.phoneNumber}</p>}
				{person.parent && !person.phoneNumber && <p>اسم الوالد/ة :{person.parent.name} </p>}
				<p>العمر : {Number(person.age).toFixed(0)}</p>
				<p>تاريخ الميلاد : {moment(person.birthDate).format("DD/MM/YYYY")}</p>
				{person.parent && person.phoneNumber && <p>اسم الوالد/ة :{person.parent.name} </p>}
				{person.spouse && <p>اسم الزوج/ة : {person.spouse.name}</p>}
				<p>النوع : {person.gender === "male" ? "ذكر" : "انثى"}</p>
			</div>
			{
				<div className="btn-container">
					<CustomButton text="تعديل" classes="next-btn" onClick={updatePerson} />
				</div>
			}
		</div>
	);
};
export default PersonCard;
