const Person = require("../models/person");
const validator = require("validator");
const mongoose = require("mongoose");
const moment = require("moment");
const getPerson = async (req, res) => {
	try {
		const { email, phoneNumber } = req.body;
		if (!validator.isEmail(email)) return res.status(400).send("Invalid Email");
		if (!validator.isMobilePhone(phoneNumber, "he-IL")) return res.status(400).send("Invalid Phone Number");
		const person = await Person.findOne({
			email: email.toLowerCase(),
			phoneNumber: phoneNumber,
		})
			.populate("children")
			.populate("spouse");
		if (!person)
			return res.send({
				name: "",
				email,
				phoneNumber,
				children: [],
				birthDate: new Date(),
				gender: "",
				spouse: { _id: new mongoose.Types.ObjectId() },
				age: 0,
			});
		res.send(person);
	} catch (e) {
		res.status(500).send(e.message);
	}
};
const getAllPeople = async (req, res) => {
	let people = [];
	people = await Person.find({});
	await Promise.all(
		people.map((person) => {
			person.age = moment().diff(person.birthDate, "years", true);
			person.save();
		})
	);
	if (people.length < 1) return res.status(404).send("No Data Found");
	res.send([...people, ...children]);
};
const editPerson = async (req, res) => {
	try {
		const { email, name, phoneNumber, children, birthDate, spouse, gender } = req.body;
		let person = await Person.findOne({ email: email });
		if (!person) {
			person = new Person({
				name,
				email,
				phoneNumber,
				children: children.map((child) => {
					return child._id;
				}),
				gender,
				birthDate,
				spouse: spouse._id,
				age: moment().diff(birthDate, "years", true),
			});
			await person.save();
		} else {
			person.email = email;
			person.birthDate = birthDate;
			person.name = name;
			person.gender = gender;
			person.phoneNumber = phoneNumber;
			person.children = children.map((child) => {
				return child._id;
			});
			person.spouse = spouse._id;
			person.age = moment().diff(birthDate, "years", true);
			await person.save();
		}
		spouse.age = moment().diff(spouse.birthDate, "years", true);
		spouse.spouse = person._id;
		let spouseObject = await Person.findById(spouse._id);
		if (!spouseObject) {
			spouseObject = new Person(spouse);
			await spouseObject.save();
		} else {
			spouseObject.email = spouse.email;
			spouseObject.birthDate = spouse.birthDate;
			spouseObject.name = spouse.name;
			spouseObject.gender = spouse.gender;
			spouseObject.phoneNumber = spouse.phoneNumber;
			await spouseObject.save();
		}
		children.forEach(async (child) => {
			child.age = moment().diff(child.birthDate, "years", true);
			let newChild = await Person.findById(child._id);
			if (!newChild) newChild = new Person(child);
			else {
				newChild.name = child.name;
				newChild.birthDate = child.birthDate;
				newChild.phoneNumber = child.phoneNumber;
				newChild.age = child.age;
			}
			await newChild.save();
		});
		res.send(person);
	} catch (e) {
		console.log(e);
		if (e.message.includes("E11000")) return res.status(400).send("User already Exists!");
		res.status(500).send(e.message);
	}
};
module.exports = { getPerson, editPerson, getAllPeople };
