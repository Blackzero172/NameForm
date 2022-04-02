const Person = require("../models/person");
const validator = require("validator");
const getPerson = async (req, res) => {
	try {
		const { IdNumber, phoneNumber } = req.params;
		if (!validator.isIdentityCard(IdNumber, "he-IL")) return res.status(400).send("Invalid ID number");
		if (!validator.isMobilePhone(phoneNumber, "he-IL")) return res.status(400).send("Invalid Phone Number");
		const person = await Person.findOne({ IdNumber: IdNumber, phoneNumber: phoneNumber });
		if (!person) return res.send({ name: "", IdNumber, phoneNumber, children: [], birthDate: new Date() });
		res.send(person);
	} catch (e) {
		res.status(500).send(e.message);
	}
};
const editPerson = async (req, res) => {
	try {
		const { IdNumber, name, phoneNumber, children, birthDate } = req.body;
		let person = await Person.findOne({ IdNumber: IdNumber });
		if (!person) {
			person = new Person({ name, IdNumber, phoneNumber, children, birthDate });
			await person.save();
		} else {
			person.IdNumber = IdNumber;
			person.birthDate = birthDate;
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
