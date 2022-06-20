const express = require("express");
require("./db/mongoose.js");
const userRouter = require("./routes/user.js");
const taskRouter = require("./routes/task.js");

const app = express();
const port = 39853;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is running at : ` + port);
});
