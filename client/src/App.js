import moment from "moment";
import { useRef, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import mongoose from "mongoose";
import Spinner from "./components/Spinner/Spinner";
import api from "./api/api";
import LoginPage from "./Pages/LoginPage/LoginPage";
import Dashboard from "./Pages/Dashboard/Dashboard";
import FormPage from "./Pages/FormPage/FormPage";

import "./utils/utils.css";
import "./App.css";

function App() {
	const [loggedInUser, setUser] = useState({});
	const [person, setPerson] = useState({});
	const [credentials, setCredentials] = useState({
		email: "",
		password: "",
		phoneNumber: "",
		secretKey: "",
	});
	const spinnerRef = useRef();

	const setLoading = (isShown) => {
		if (isShown) spinnerRef.current.classList.remove("hidden");
		else if (!isShown) spinnerRef.current.classList.add("hidden");
	};

	const onLogin = async () => {
		setLoading(true);
		try {
			const res = await api.post("/users/login", credentials);
			const user = res.data.user;
			setUser(user);
		} catch (e) {
			return e.response.data;
		} finally {
			setLoading(false);
		}
	};
	const getData = async () => {
		setLoading(true);
		try {
			const data = await api.post(`/people/`, credentials);
			const person = data.data;
			person.birthDate = moment(person.birthDate).format("yyyy-MM-DD");
			person.children.forEach((child) => {
				child.birthDate = moment(child.birthDate).format("yyyy-MM-DD");
			});
			if (person.spouse) person.spouse.birthDate = moment(person.spouse.birthDate).format("yyyy-MM-DD");
			else
				person.spouse = {
					_id: new mongoose.Types.ObjectId(),
					gender: person.gender === "male" ? "female" : "male",
				};
			setPerson(person);
		} catch (e) {
			throw new Error(e.response.data);
		} finally {
			setLoading(false);
		}
	};
	const updatePerson = async () => {
		setLoading(true);
		try {
			if (!person.spouse.hasOwnProperty("name")) delete person.spouse;
			const response = await api.put("/people", person);
			return response.data;
		} catch (e) {
			throw new Error(e.response.data);
		} finally {
			setLoading(false);
		}
	};

	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact>
					{!loggedInUser.hasOwnProperty("name") ? (
						<LoginPage setCredentials={setCredentials} credentials={credentials} onLogin={onLogin} />
					) : (
						<Dashboard />
					)}
				</Route>
				<Route path="/form">
					<FormPage
						setCredentials={setCredentials}
						credentials={credentials}
						getPerson={getData}
						person={person}
						setUser={setPerson}
						updatePerson={updatePerson}
					/>
				</Route>
			</Switch>
			<Spinner spinnerRef={spinnerRef} />
		</BrowserRouter>
	);
}

export default App;
