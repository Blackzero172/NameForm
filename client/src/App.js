import "./App.css";
import Spinner from "./components/Spinner/Spinner.components";
import api from "./api/api";
import { useEffect, useRef, useState } from "react";
function App() {
  const [loggedInUser, setUser] = useState({});
  const emailRef = useRef();
  const passRef = useRef();
  const spinnerRef = useRef();
  const inputRefs = {
    emailRef,
    passRef,
  };

  const setLoading = (isShown) => {
    if (isShown) spinnerRef.current.classList.remove("hidden");
    else if (!isShown) spinnerRef.current.classList.add("hidden");
  };

  const onLogin = async () => {
    setLoading(true);
    const [emailInput, passInput] = [emailRef.current, passRef.current];
    let credentials;
    if (emailInput) {
      credentials = { email: emailInput.value, password: passInput.value };
    }
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
  return <Spinner spinnerRef={spinnerRef} />;
}

export default App;
