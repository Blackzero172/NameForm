const Person = require("../models/person");
const validator = require("validator");
const mongoose = require("mongoose");
const moment = require("moment");
const _ = require("lodash");
const getPerson = async (req, res) => {
	console.log(req.body);
	try {
		const { email, phoneNumber, id } = req.body;
		let person;
		if (!id) {
			if (!validator.isEmail(email)) return res.status(400).send("Invalid Email");
			if (!validator.isMobilePhone(phoneNumber, "he-IL")) return res.status(400).send("Invalid Phone Number");
			person = await Person.findOne({
				email: email.toLowerCase().trim(),
				phoneNumber: phoneNumber,
			})
				.populate("children")
				.populate("spouse");
		} else {
			person = await Person.findById(id);
		}
		if (!person)
			return res.send({
				_id: new mongoose.Types.ObjectId(),
				name: "",
				email,
				phoneNumber,
				children: [],
				birthDate: "",
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
	try {
		let parents = await Person.find({
			$or: [{ "children.0": { $exists: true } }, { spouse: { $exists: true } }],
		})
			.populate({ path: "spouse", populate: { path: "spouse" } })
			.populate({
				path: "children",
				populate: { path: "parent" },
			});
		parents.sort((a, b) => b.children.length - a.children.length);
		for (let i = 0; i < parents.length; i++) {
			const parent = parents[i];
			if (parent.spouse) parents = parents.filter((spouse) => !parent.spouse._id.equals(spouse._id));
		}
		let children = await Person.find({
			parent: { $exists: false },
			"children.0": { $exists: false },
			spouse: { $exists: false },
		});
		const people = [];
		parents.forEach((parent) => {
			if (parent.spouse) people.push(parent, parent.spouse, ...parent.children);
			else people.push(parent, ...parent.children);
		});
		children.forEach((child) => {
			if (
				!people.find(
					(person) =>
						moment(person.birthDate).diff(child.birthDate, "days") === 0 &&
						person.name.split(" ")[0] === child.name.split(" ")[0]
				)
			)
				people.push(child);
		});

		res.send(people);
	} catch (e) {
		console.log(e);
		res.status(500).send(`Server Error :${e}`);
	}
};
const editPerson = async (req, res) => {
	try {
		const { email, phoneNumber, gender, name, children, birthDate, spouse } = req.body;
		let person = await Person.findOne({ email: email, phoneNumber: phoneNumber });
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
				age: moment().diff(birthDate, "years", true),
			});
			if (spouse.name) person.spouse = spouse._id;
			else person.spouse = undefined;
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
			if (spouse.name) person.spouse = spouse._id;
			else person.spouse = undefined;
			person.age = moment().diff(birthDate, "years", true);
			await person.save();
		}
		if (spouse.name) {
			spouse.age = moment().diff(spouse.birthDate, "years", true);
			spouse.spouse = person._id;
			spouse.children = children.map((child) => {
				return child._id;
			});
			let spouseObject = await Person.findOne({ email: spouse.email, phoneNumber: spouse.phoneNumber });
			if (spouseObject) {
				if (spouse) person.spouse = spouseObject._id;
				await person.save();
			} else {
				spouseObject = await Person.findById(spouse._id);
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
			}
		}
		children.forEach(async (child) => {
			try {
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
			} catch (e) {
				console.error(e);
			}
		});
		res.send(person);
	} catch (e) {
		console.log(e);
		if (e.message.includes("E11000")) return res.status(400).send("User already Exists!");
		res.status(500).send(`Server Error :${e.message}`);
	}
};
module.exports = { getPerson, editPerson, getAllPeople };
