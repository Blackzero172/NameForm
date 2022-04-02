import { useEffect, useRef, useState } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Spinner from "./components/Spinner/Spinner";
import api from "./api/api";
import LoginPage from "./Pages/LoginPage/LoginPage";
import CustomButton from "./components/CustomButton/CustomButton.components";
import FormPage from "./Pages/FormPage/FormPage";

import "./utils/utils.css";
import "./App.css";

function App() {
	const [loggedInUser, setUser] = useState({});
	const [credentials, setCredentials] = useState({ email: "", password: "", phoneNumber: "", IdNumber: "" });
	const spinnerRef = useRef();

	const setLoading = (isShown) => {
		if (isShown) spinnerRef.current.classList.remove("hidden");
		else if (!isShown) spinnerRef.current.classList.add("hidden");
	};

	const onLogin = async () => {
		setLoading(true);
		try {
			console.log(credentials);
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
			const data = await api.get(`/people/${credentials.IdNumber}`);
			setUser(data.data);
		} catch (e) {
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
						<LoginPage setCredentials={setCredentials} credentials={credentials} onLogin={onLogin} />
					) : (
						<p>
							{`Welcome ${loggedInUser.name}`} <CustomButton onClick={onLogout} text="Logout" />
						</p>
					)}
				</Route>
				<Route path="/form">
					<FormPage
						setCredentials={setCredentials}
						credentials={credentials}
						getPerson={getData}
						person={loggedInUser}
						setUser={setUser}
					/>
				</Route>
			</Switch>
			<Spinner spinnerRef={spinnerRef} />
		</BrowserRouter>
	);
}

export default App;
