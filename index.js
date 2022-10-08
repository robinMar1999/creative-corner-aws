const express = require("express");
const path = require("path");
const router = require("./routes/main");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.use(router);

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
