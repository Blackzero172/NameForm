import api from "../api/api";
import moment from "moment";
const getUsers = async () => {
	const users = await api.get("/users");
	return users;
};
const onNumberInputChange = (e) => {
	const regex = /[\d]+/g;
	const newArr = e.target.value.split("").filter((x) => x.match(regex));
	e.target.value = newArr.join("");
};
const loginRequest = async (email, password) => {
	const user = await api.post("/users/login", { email, password });
	return user;
};
const logoutRequest = async (token) => {
	const res = await api.post("/users/logout");
	return res;
};
const displayErrorMessage = (ref, message, id) => {
	ref.current.innerText = message;
	id = setTimeout(() => {
		ref.current.innerText = "";
	}, 3000);
	return id;
};
export { getUsers, onNumberInputChange, loginRequest, displayErrorMessage, logoutRequest };
