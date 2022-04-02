import "./utils/utils.css";
import "./App.css";
import Spinner from "./components/Spinner/Spinner";
import api from "./api/api";
import { useEffect, useRef, useState } from "react";
import LoginPage from "./Pages/LoginPage";
import CustomButton from "./components/CustomButton/CustomButton.components";
function App() {
	const [loggedInUser, setUser] = useState({});
	const [credentials, setCredentials] = useState({ email: "", password: "" });
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
			console.error(e.response);
			return e.response.data;
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
		<>
			{!loggedInUser.hasOwnProperty("name") ? (
				<LoginPage setCredentials={setCredentials} credentials={credentials} onLogin={onLogin} />
			) : (
				<p>
					{`Welcome ${loggedInUser.name}`} <CustomButton onClick={onLogout} text="Logout" />
				</p>
			)}
			<Spinner spinnerRef={spinnerRef} />
		</>
	);
}

export default App;
