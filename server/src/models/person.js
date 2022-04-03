const mongoose = require("mongoose");
const validator = require("validator");
const personSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	IdNumber: {
		type: String,
		required: true,
		validate(val) {
			if (!validator.isIdentityCard(val, "he-IL")) {
				throw new Error("Invalid ID number");
			}
		},
		unique: true,
	},
	phoneNumber: {
		type: String,
		required: true,
		validate(val) {
			if (!validator.isMobilePhone(val, "he-IL"))
				throw new Error("Invalid Phone Number");
		},
	},
	birthDate: {
		type: Date,
		required: true,
	},
	children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Child" }],
});
personSchema.methods.toJSON = function () {
	const person = this;
	const personObject = person.toObject();

	delete personObject._id;
	delete personObject.__v;
	return personObject;
};
const Person = mongoose.model("Person", personSchema);
module.exports = Person;
