const mongoose = require("mongoose");
const validator = require("validator");
const personSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		lowercase: true,
		trim: true,
		validate(val) {
			if (!validator.isEmail(val)) throw new Error("Invalid Email");
		},
	},
	phoneNumber: {
		type: String,
		validate(val) {
			if (!validator.isMobilePhone(val, "he-IL")) throw new Error("Invalid Phone Number");
		},
	},
	birthDate: {
		type: Date,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
	gender: {
		type: String,
		required: true,
	},
	parentName: {
		type: String,
	},
	spouse: { type: mongoose.Schema.Types.ObjectId, ref: "Person" },
	children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Person" }],
});

const Person = mongoose.model("Person", personSchema);
module.exports = Person;
