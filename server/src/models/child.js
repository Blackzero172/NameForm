const mongoose = require("mongoose");
const validator = require("validator");
const childSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
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
	age: {
		type: Number,
		required: true,
	},
});

const Child = mongoose.model("Child", childSchema);
module.exports = Child;
