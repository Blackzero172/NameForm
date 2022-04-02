const express = require("express");
const User = require("../models/user");
const { addUser, getUsers, verifyToken } = require("./utils/utils");
const app = express();
app.use(express.json());

const getAllUsers = async (req, res) => {
	try {
		const { email } = req.body;
		const users = await getUsers(email);
		if (users.length < 1) return res.status(404).send("No Users Found");
		res.send(users);
	} catch (e) {
		if (e.message.includes("invalid")) return res.status(400).send(e.message);
		res.status(500).send(e.message);
	}
};
const getProfile = (req, res) => {
	const user = req.user;
	res.send(user);
};

const editUser = async (req, res) => {
	try {
		const { userID, newName, newIdNumber, newPhoneNumber } = req.body;
		const user = await User.findOne({ IdNumber: userID });
		if (!user) return res.status(404).send("User not found");
		user.name = newName;
		user.IdNumber = newIdNumber;
		user.phoneNumber = newPhoneNumber;
		await user.save();
		res.send(user);
	} catch (e) {
		res.status(500).send(e.message);
	}
};
const editProfile = async (req, res) => {
	const user = req.user;
	const { newName, newEmail, newPassword, newIdNumber } = req.body;
	user.name = newName;
	user.email = newEmail;
	user.IdNumber = newIdNumber;
	if (newPassword !== "" && newPassword) {
		user.password = newPassword;
	}
	await user.save();
	res.send(user);
};
const login = async (req, res) => {
	const { email, password } = req.body;
	const { token } = req.cookies;
	let user;
	try {
		if (token) {
			const verify = await verifyToken(token);
			return res.send(verify);
		}
		user = await User.findByCredentials(email, password);
		const genToken = await user.generateToken();
		res.cookie("token", genToken, {
			httpOnly: true,
			sameSite: "lax",
		});
		res.send({ message: "Logged in!", user });
	} catch (e) {
		if (e.message.includes("expired")) {
			res.clearCookie("token");
			const user = await User.findByToken(token);
			if (user) {
				user.tokens = user.tokens.filter((currentToken) => currentToken.token !== token);
				await user.save();
			}
		}
		res.status(500).send(e.message);
	}
};

const logout = async (req, res) => {
	try {
		const { user, token } = req;
		user.tokens = user.tokens.filter((currentToken) => currentToken.token !== token);
		await user.save();
		res.clearCookie("token");
		res.send("Logged out!");
	} catch (e) {
		res.status(500).send(e.message);
	}
};

const postUser = async (req, res) => {
	try {
		const { token } = req.cookies;
		const user = await addUser(req.body);
		const genToken = await user.generateToken();
		if (!token) {
			res.cookie("token", genToken, {
				sameSite: "lax",
			});
			res.status(201).send({ user, genToken });
		} else res.status(201).send({ user });
	} catch (e) {
		if (e.message.includes("E11000")) return res.status(400).send("User already exists");
		res.status(500).send(e.message);
	}
};

module.exports = {
	getAllUsers,
	postUser,
	login,
	logout,
	editUser,
	editProfile,
	getProfile,
};
