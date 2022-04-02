const Person = require("../models/person");
const getAllPeople = async (req, res) => {
	try {
		const { IdNumber } = req.body;
		const people = await Person.findOne({ IdNumber });
		if (people.length < 1) return res.status(404).send("No Data Found");
		res.send(people);
	} catch (e) {
		res.status(500).send(e.message);
	}
};
const editPerson = async (req, res) => {
	try {
		const { IdNumber, name, phoneNumber, children } = req.body;
		let person = await Person.findOne({ IdNumber });
		if (!person) {
			person = new Person({ name, IdNumber, phoneNumber, children });
			await person.save();
		} else {
			person.name = name;
			person.phoneNumber = phoneNumber;
			person.children = children;
			await person.save();
		}
		res.send(person);
	} catch (e) {
		if (e.message.includes("E11000")) return res.status(400).send("User already Exists!");
		res.status(500).send(e.message);
	}
};
module.exports = { getAllPeople, editPerson };
