const express = require("express");
const { getAllPeople, getPerson, editPerson } = require("../controllers/person.controllers");

const PersonRouter = express.Router();

PersonRouter.get("/people/:IdNumber/:phoneNumber", getPerson);
PersonRouter.get("/people/:isTree", getAllPeople);

PersonRouter.put("/people", editPerson);

module.exports = PersonRouter;
