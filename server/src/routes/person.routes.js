const express = require("express");
const { getAllPeople, getPerson, editPerson } = require("../controllers/person.controllers");
const secretKey = require("../middleware/secretKey");
const PersonRouter = express.Router();

PersonRouter.post("/people", secretKey, getPerson);
PersonRouter.get("/people", getAllPeople);

PersonRouter.put("/people", editPerson);

module.exports = PersonRouter;
