const express = require("express");
const PersonRouter = require("./routes/person.routes");
const UserRouter = require("./routes/user.routes");
const apiRouter = express.Router();

apiRouter.use("/", UserRouter);
apiRouter.use("/", PersonRouter);
module.exports = apiRouter;
