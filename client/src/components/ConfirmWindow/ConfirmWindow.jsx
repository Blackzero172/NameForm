import CustomButton from "../CustomButton/CustomButton.components";
import "./ConfirmWindow.css";
const ConfirmWindow = ({ personName, closeWindow }) => {
	return (
		<div className="confirm-window flex-both">
			<div className="window flex-column flex-both">
				<p> هل انت متأكد من حذف {personName}؟</p>
				<div className="btn-container">
					<CustomButton text="نعم" classes="prev-btn" />
					<CustomButton text="لا" classes="next-btn" onClick={closeWindow} />
				</div>
			</div>
		</div>
	);
};
export default ConfirmWindow;
