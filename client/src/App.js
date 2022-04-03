import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Spinner from "./components/Spinner/Spinner";
import api from "./api/api";
import LoginPage from "./Pages/LoginPage/LoginPage";
import Dashboard from "./Pages/Dashboard/Dashboard";
import FormPage from "./Pages/FormPage/FormPage";

import "./utils/utils.css";
import "./App.css";

function App() {
	const [loggedInUser, setUser] = useState({});
	const [credentials, setCredentials] = useState({
		email: "",
		password: "",
		phoneNumber: "",
		IdNumber: "",
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
			const data = await api.get(
				`/people/${credentials.IdNumber}/${credentials.phoneNumber}`
			);
			console.log(data);
			data.data.birthDate = moment(data.data.birthDate).format("yyyy-MM-DD");
			data.data.children.forEach((child) => {
				child.birthDate = moment(child.birthDate).format("yyyy-MM-DD");
			});
			setUser(data.data);
		} catch (e) {
			throw new Error(e.response.data);
		} finally {
			setLoading(false);
		}
	};
	const updatePerson = async () => {
		setLoading(true);
		try {
			const response = await api.put("/people", loggedInUser);
			return response.data;
		} catch (e) {
			throw new Error(e.response.data);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		onLogin();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const onLogout = async () => {
		setLoading(true);
		try {
			await api.post("/users/logout");
			setUser({});
		} catch (e) {
			console.error(e.response.data);
		} finally {
			setLoading(false);
		}
	};
	const getProfile = async () => {
		const user = await api.get("/users/me");
		setUser(user.data);
	};
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/" exact>
					{!loggedInUser.hasOwnProperty("name") ? (
						<LoginPage
							setCredentials={setCredentials}
							credentials={credentials}
							onLogin={onLogin}
						/>
					) : (
						<Dashboard />
					)}
				</Route>
				<Route path="/form">
					<FormPage
						setCredentials={setCredentials}
						credentials={credentials}
						getPerson={getData}
						person={loggedInUser}
						setUser={setUser}
						updatePerson={updatePerson}
					/>
				</Route>
			</Switch>
			<Spinner spinnerRef={spinnerRef} />
		</BrowserRouter>
	);
}

export default App;
