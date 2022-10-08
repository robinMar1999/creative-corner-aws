const express = require("express");
const s3Accessor = require("../controllers/s3Accessor");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const oneImagePerProject = await s3Accessor.getOneImagePerProject();
    res.render("index", {
      oneImagePerProject,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).render("500");
  }
});

router.get("/gallery", async (req, res) => {
  try {
    const projects = await s3Accessor.getProjectsWithImages();
    res.render("gallery", {
      projects,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).render("500");
  }
});

router.get("/contact", async (req, res) => {
  try {
    res.render("contact");
  } catch (err) {
    console.error(err.message);
    res.status(500).render("500");
  }
});

module.exports = router;
