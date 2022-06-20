const express = require("express");
require("./db/mongoose.js");
const userRouter = require("./routes/user.js");
const taskRouter = require("./routes/task.js");

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is running at : ` + port);
});
