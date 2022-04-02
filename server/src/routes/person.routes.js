const express = require("express");
const { getAllPeople, editPerson } = require("../controllers/person.controllers");

const PersonRouter = express.Router();

PersonRouter.get("/people", getAllPeople);

PersonRouter.put("/people", editPerson);

module.exports = PersonRouter;
