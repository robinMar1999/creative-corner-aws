const express = require("express");
const path = require("path");
const aws = require("./providers/aws");

const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.set("views", path.join(__dirname, "views"));

const s3 = aws.s3Client.getInstance();

app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/gallery", async (req, res) => {
  try {
    const response = await s3
      .listObjects({
        Bucket: "projects-puneet-panwar-2408",
      })
      .promise();
    const prefix =
      "https://projects-puneet-panwar-2408.s3.ap-south-1.amazonaws.com/";
    const projects = new Object();
    response.Contents.forEach((item) => {
      if (item.Size === 0) {
        const arr = item.Key.split("/");
        projects[arr[0]] = [];
      }
    });
    response.Contents.forEach((item) => {
      if (item.Size > 0) {
        const arr = item.Key.split("/");
        projects[arr[0]].push(prefix + encodeURIComponent(item.Key));
      }
    });
    res.render("gallery", {
      projects,
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/contact", async (req, res) => {
  res.render("contact");
});

const port = process.env.PORT || 80;

app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
