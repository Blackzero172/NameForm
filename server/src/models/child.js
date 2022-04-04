const mongoose = require("mongoose");
const validator = require("validator");
const childSchema = mongoose.Schema({
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
			if (!validator.isMobilePhone(val, "he-IL") && val !== "") throw new Error("Invalid Phone Number");
		},
	},
	birthDate: {
		type: Date,
		required: true,
	},
	parentName: {
		type: String,
		required: true,
	},
	age: {
		type: Number,
		required: true,
	},
});

const Child = mongoose.model("Child", childSchema);
module.exports = Child;
