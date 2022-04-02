const express = require("express");
const auth = require("../middleware/auth");
const {
	postUser,
	login,
	logout,
	getAllUsers,
	editUser,
	editProfile,
	getProfile,
} = require("../controllers/user.controllers");

const UserRouter = express.Router();

UserRouter.get("/users", auth, getAllUsers);
UserRouter.get("/users/me", auth, getProfile);

UserRouter.post("/users/login", login);
UserRouter.post("/users/signup", auth, postUser);
UserRouter.post("/users/logout", auth, logout);

UserRouter.put("/users", auth, editUser);
UserRouter.put("/users/me", auth, editProfile);

module.exports = UserRouter;
