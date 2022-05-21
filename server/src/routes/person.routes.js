const express = require("express");
const { getAllPeople, getPerson, editPerson } = require("../controllers/person.controllers");
const auth = require("../middleware/auth");
const PersonRouter = express.Router();

PersonRouter.post("/people", auth, getPerson);
PersonRouter.get("/people", getAllPeople);

PersonRouter.put("/people", editPerson);

module.exports = PersonRouter;
