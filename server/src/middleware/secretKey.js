const secretKey = async (req, res, next) => {
	try {
		const secretKey = req.body.secretKey;
		if (secretKey.toLowerCase().trim() === process.env.SECRET_KEY) return next();
		else throw new Error("");
	} catch (e) {
		res.status(401).send("Wrong Key");
	}
};

module.exports = secretKey;
