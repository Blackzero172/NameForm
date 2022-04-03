const Person = require("../models/person");
const validator = require("validator");
const Child = require("../models/child");
const moment = require("moment");
const getPerson = async (req, res) => {
	try {
		const { IdNumber, phoneNumber } = req.body;
		if (!validator.isIdentityCard(IdNumber, "he-IL")) return res.status(400).send("Invalid ID number");
		if (!validator.isMobilePhone(phoneNumber, "he-IL")) return res.status(400).send("Invalid Phone Number");
		const person = await Person.findOne({
			IdNumber: IdNumber,
			phoneNumber: phoneNumber,
		}).populate("children");
		if (!person)
			return res.send({
				name: "",
				IdNumber,
				phoneNumber,
				children: [],
				birthDate: new Date(),
				age: 0,
			});
		res.send(person);
	} catch (e) {
		res.status(500).send(e.message);
	}
};
const getAllPeople = async (req, res) => {
	let people = [];
	let children = [];
	people = await Person.find({}).populate("children");
	await Promise.all(
		people.map((person) => {
			person.age = moment().diff(person.birthDate, "years", true);
			person.save();
		})
	);
	children = await Child.find({});
	await Promise.all(
		children.map((child) => {
			child.age = moment().diff(child.birthDate, "years", true);
			child.save();
		})
	);
	if (people.length < 1) return res.status(404).send("No Data Found");
	res.send([...people, ...children]);
};
const editPerson = async (req, res) => {
	try {
		const { IdNumber, name, phoneNumber, children, birthDate } = req.body;
		let person = await Person.findOne({ IdNumber: IdNumber });
		let child = await Child.findOne({});
		if (!person) {
			person = new Person({
				name,
				IdNumber,
				phoneNumber,
				children,
				birthDate,
				age: moment().diff(birthDate, "years", true),
			});
			await person.save();
		} else {
			person.IdNumber = IdNumber;
			person.birthDate = birthDate;
			person.name = name;
			person.phoneNumber = phoneNumber;
			children.forEach(async (child) => {
				child.age = moment().diff(child.birthDate, "years", true);
				let newChild = await Child.findById(child._id);
				if (!newChild) newChild = new Child(child);
				else {
					newChild.name = child.name;
					newChild.birthDate = child.birthDate;
					newChild.phoneNumber = child.phoneNumber;
					newChild.age = child.age;
				}
				await newChild.save();
			});
			(person.age = moment().diff(birthDate, "years", true)),
				(person.children = children.map((child) => {
					return child._id;
				}));
			await person.save();
		}
		res.send(person);
	} catch (e) {
		if (e.message.includes("E11000")) return res.status(400).send("User already Exists!");
		res.status(500).send(e.message);
	}
};
module.exports = { getPerson, editPerson, getAllPeople };
