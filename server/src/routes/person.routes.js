const express = require("express");
const { getPerson, editPerson } = require("../controllers/person.controllers");

const PersonRouter = express.Router();

PersonRouter.get("/people/:IdNumber/:phoneNumber", getPerson);

PersonRouter.put("/people", editPerson);

module.exports = PersonRouter;
