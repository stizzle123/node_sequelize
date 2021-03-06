const router = require("express").Router();
const Sequelize = require("sequelize");
// const db = require("../config/database");
const Gig = require("../models/Gigs");
const Op = Sequelize.Op;

router.get("/", (req, res) => {
  Gig.findAll()
    .then(gigs =>
      res.render("gigs", {
        gigs,
        title: "Gigs"
      })
    )
    .catch(err => console.log(err));
});

// Display add a gig form
router.get("/add", (req, res) => res.render("add", { title: "Add Gigs" }));

// Add a gig
router.post("/add", (req, res) => {
  let { title, technologies, budget, description, contact_email } = req.body;

  let errors = [];

  // Validate inputs
  if (!title) {
    errors.push({ text: "Please add a title" });
  }
  if (!technologies) {
    errors.push({ text: "Please add some technologies" });
  }
  if (!description) {
    errors.push({ text: "Please add a description" });
  }
  if (!contact_email) {
    errors.push({ text: "Please add a contact email" });
  }

  // Check for errors
  if (errors.length > 0) {
    res.render("add", {
      errors,
      title,
      technologies,
      budget,
      description,
      contact_email
    });
  } else {
    if (!budget) {
      budget = "Unknown";
    } else {
      budget = `$${budget}`;
    }

    // Make lowercase and remove space after comma
    technologies = technologies.toLowerCase().replace(/, /g, ",");

    Gig.create({
      title,
      technologies,
      budget,
      description,
      contact_email
    })
      .then(gig => res.redirect("/gigs"))
      .catch(err => console.log(err));
  }
});

router.get("/search", (req, res) => {
  let { term } = req.query;

  term = term.toLowerCase();

  Gig.findAll({
    where: {
      technologies: { [Op.like]: "%" + term + "%" }
    }
  })
    .then(gigs => res.render("gigs", { title: "Search technologies", gigs }))
    .catch(err => console.log(err));
});

module.exports = router;
