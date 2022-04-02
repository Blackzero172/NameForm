const Person = require("../models/person");
const getPerson = async (req, res) => {
	try {
		const { IdNumber } = req.params;
		const person = await Person.findOne({ IdNumber: IdNumber });
		if (!person) return res.status(404).send({});
		res.send(person);
	} catch (e) {
		res.status(500).send(e.message);
	}
};
const editPerson = async (req, res) => {
	try {
		const { IdNumber, name, phoneNumber, children } = req.body;
		let person = await Person.findOne({ IdNumber: IdNumber });
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
module.exports = { getPerson, editPerson };
