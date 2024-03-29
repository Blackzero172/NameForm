require("dotenv").config();
require("./src/db/mongoose");
const path = require("path");
const { getReact } = require("./src/controllers/utils/utils");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const Router = require("./src/Router");
const port = process.env.PORT || 8080;
const server = express();
const corsOptions = {
	origin: "http://localhost:3000",
	credentials: true,
};

server.use(express.json());
server.use(cors(corsOptions));
server.use(cookieParser());
server.use("/api", Router);
server.use(express.static(getReact()));
server.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
});

server.listen(port, () => {
	console.log(`Server is up and listening on port ${port}`);
});
